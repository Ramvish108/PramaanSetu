import io
import os
import threading
import traceback
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

import torch
from PIL import Image
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from transformers import AutoImageProcessor, AutoModelForImageClassification

load_dotenv()

PRODUCTION_URL = os.getenv("PRODUCTION_URL", "")
PORT = int(os.environ.get("PORT", 8000))

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models" / "ai-detector"

MAX_UPLOAD_BYTES = 10 * 1024 * 1024
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

processor = None
model = None
model_loading_error = None
model_loading_complete = False
model_loading_started = False

# ---------------------------------------------------------------------------
# Model functions
# ---------------------------------------------------------------------------

def download_model_if_needed():
    """Download model from Hugging Face if not available locally"""
    if MODEL_DIR.exists() and (MODEL_DIR / "model.safetensors").exists():
        print("✅ Model already exists locally")
        return True
    
    print("📥 Downloading model from Hugging Face...")
    try:
        from huggingface_hub import snapshot_download
        os.makedirs(MODEL_DIR, exist_ok=True)
        snapshot_download(
            repo_id="Smogy/SMOGY-Ai-images-detector",
            local_dir=str(MODEL_DIR),
            local_dir_use_symlinks=False,
            ignore_patterns=["*.h5", "*.ot", "*.msgpack"],
        )
        print("✅ Model downloaded successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to download model: {e}")
        return False

def load_local_model():
    """Load the AI model in the background"""
    global processor, model, model_loading_error, model_loading_complete, model_loading_started
    
    # Prevent multiple simultaneous loads
    if model_loading_started:
        print("⏳ Model loading already in progress...")
        return
    
    model_loading_started = True
    
    try:
        print("🔍 Starting model loading process...")
        
        # Download if needed
        if not download_model_if_needed():
            model_loading_error = "Download failed"
            model_loading_complete = True
            return

        if not MODEL_DIR.exists():
            model_loading_error = f"Model directory not found: {MODEL_DIR}"
            print(f"❌ {model_loading_error}")
            model_loading_complete = True
            return

        required_files = ["model.safetensors", "config.json", "preprocessor_config.json"]
        missing = [f for f in required_files if not (MODEL_DIR / f).exists()]
        
        if missing:
            model_loading_error = f"Missing files: {missing}"
            print(f"❌ {model_loading_error}")
            model_loading_complete = True
            return

        print(f"✅ Loading model from: {MODEL_DIR}")
        
        # Load processor
        print("📥 Loading processor...")
        processor = AutoImageProcessor.from_pretrained(str(MODEL_DIR))
        print("✅ Processor loaded")
        
        # Load model
        print("📥 Loading model...")
        model = AutoModelForImageClassification.from_pretrained(str(MODEL_DIR))
        print("✅ Model loaded")
        
        # Move to device
        print(f"📤 Moving model to {DEVICE}...")
        model.to(DEVICE)
        model.eval()
        print("✅ Model ready!")

    except Exception as e:
        model_loading_error = str(e)
        print(f"❌ Model loading failed: {e}")
        traceback.print_exc()
        processor = None
        model = None
    finally:
        model_loading_complete = True

# Start loading model in background
print("🚀 Starting model loading in background thread...")
thread = threading.Thread(target=load_local_model)
thread.daemon = True
thread.start()

# ---------------------------------------------------------------------------
# FastAPI lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_: FastAPI):
    print("🚀 Server starting...")
    print("📡 Model loading is happening in the background.")
    print("✅ Server is ready to accept requests.")
    
    yield
    
    print("🛑 Shutting down...")

# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="PramaanSetu AI Screening",
    version="1.0.0",
    docs_url="/docs",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://pramaan-setu-rose.vercel.app",
        "https://*.vercel.app",
        "https://web-production-97025.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "traceback": traceback.format_exc()}
    )

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/ping")
async def ping():
    """Simple ping endpoint - always works"""
    return {
        "pong": "alive",
        "timestamp": str(datetime.now()),
        "model_loaded": model is not None,
        "model_loading_complete": model_loading_complete
    }

@app.get("/api/test")
async def test():
    return {"status": "ok", "message": "API is working"}

@app.get("/")
async def root():
    return {
        "message": "PramaanSetu API running",
        "model_loaded": model is not None,
        "model_loading_complete": model_loading_complete
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_loading_complete": model_loading_complete,
        "model_error": model_loading_error,
        "timestamp": str(datetime.now())
    }

@app.post("/api/detect")
async def detect_ai_generated_image(file: UploadFile = File(...)):
    try:
        if model is None or processor is None:
            raise HTTPException(
                status_code=503,
                detail=f"Model not loaded yet. Status: {'Loading...' if not model_loading_complete else model_loading_error}"
            )

        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(415, detail="Please upload an image file")

        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(400, detail="Image is empty")

        if len(image_bytes) > MAX_UPLOAD_BYTES:
            raise HTTPException(413, detail="Image too large (max 10MB)")

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert("RGB")
        except Exception as e:
            raise HTTPException(400, detail=f"Invalid image: {str(e)}")

        # Process image
        inputs = processor(images=image, return_tensors="pt")
        inputs = {key: value.to(DEVICE) for key, value in inputs.items()}

        with torch.inference_mode():
            outputs = model(**inputs)

        probabilities = torch.softmax(outputs.logits, dim=-1)[0]
        predictions = []

        for idx, score in enumerate(probabilities):
            label = model.config.id2label.get(idx, str(idx))
            predictions.append({"label": str(label), "score": float(score)})

        predictions.sort(key=lambda x: x["score"], reverse=True)

        # Calculate risk
        synthetic = next((p for p in predictions if any(word in p["label"].lower() for word in ("ai", "fake", "generated"))), None)
        real = next((p for p in predictions if any(word in p["label"].lower() for word in ("real", "human"))), None)

        if synthetic is not None:
            risk = synthetic["score"]
        elif real is not None:
            risk = 1.0 - real["score"]
        else:
            risk = 0.5

        risk = max(0.0, min(1.0, float(risk)))

        return {
            "risk": risk,
            "percentage": round(risk * 100, 2),
            "label": "Likely AI-generated" if risk >= 0.5 else "No strong AI signal",
            "model": "Smogy/SMOGY-Ai-images-detector",
            "predictions": predictions,
            "disclaimer": "This is a screening signal, not proof."
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Detection error: {traceback.format_exc()}")
        raise HTTPException(500, detail=f"Detection failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)