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

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

load_dotenv()

PRODUCTION_URL = os.getenv("PRODUCTION_URL", "")
PORT = int(os.environ.get("PORT", 8000))

print(f"🔧 Environment: {'production' if PRODUCTION_URL else 'development'}")
print(f"📡 Port: {PORT}")

# ---------------------------------------------------------------------------
# Model configuration
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models" / "ai-detector"

MAX_UPLOAD_BYTES = 10 * 1024 * 1024
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"🔍 Model directory: {MODEL_DIR}")
print(f"⚙️  Device: {DEVICE}")

# ---------------------------------------------------------------------------
# Global model objects
# ---------------------------------------------------------------------------

processor = None
model = None
model_loading_error = None
model_loading_complete = False
model_loading_started = False

# ---------------------------------------------------------------------------
# Model loading - Runs in background thread
# ---------------------------------------------------------------------------

def load_model_in_background():
    """Load the model in a background thread so server starts immediately"""
    global processor, model, model_loading_error, model_loading_complete, model_loading_started
    
    # Prevent multiple simultaneous loads
    if model_loading_started:
        print("⏳ Model loading already in progress...")
        return
    
    model_loading_started = True
    print("🚀 Starting model loading in background thread...")
    
    try:
        # Check if model files exist
        if not MODEL_DIR.exists():
            model_loading_error = f"Model directory not found: {MODEL_DIR}"
            print(f"❌ {model_loading_error}")
            model_loading_complete = True
            return

        required_files = ["model.safetensors", "config.json", "preprocessor_config.json"]
        missing = [f for f in required_files if not (MODEL_DIR / f).exists()]
        
        if missing:
            model_loading_error = f"Missing model files: {missing}"
            print(f"❌ {model_loading_error}")
            print(f"📁 Files in directory: {os.listdir(MODEL_DIR) if MODEL_DIR.exists() else 'N/A'}")
            model_loading_complete = True
            return

        print(f"✅ Loading model from: {MODEL_DIR}")
        
        # Load processor
        print("📥 Loading processor...")
        processor = AutoImageProcessor.from_pretrained(str(MODEL_DIR), local_files_only=True)
        print("✅ Processor loaded")
        
        # Load model
        print("📥 Loading model...")
        model = AutoModelForImageClassification.from_pretrained(str(MODEL_DIR), local_files_only=True)
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
        print(f"✅ Model loading complete. Success: {model is not None}")

# Start model loading in background - SERVER STARTS IMMEDIATELY
thread = threading.Thread(target=load_model_in_background)
thread.daemon = True
thread.start()
print("✅ Server starting immediately while model loads in background...")

# ---------------------------------------------------------------------------
# FastAPI lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_: FastAPI):
    print("🚀 Server is ready to accept requests!")
    yield
    print("🛑 Shutting down...")

# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="PramaanSetu AI Screening",
    description="AI-powered image detection for PramaanSetu",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS - Allow all for testing
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:8000",
        "https://pramaan-setu-rose.vercel.app",
        "https://*.vercel.app",
        "https://web-production-97025.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"🔓 CORS configured")

# ---------------------------------------------------------------------------
# Global Exception Handler
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    error_details = {
        "error": str(exc),
        "error_type": type(exc).__name__,
        "traceback": traceback.format_exc(),
        "timestamp": str(datetime.now()),
    }
    print(f"❌ Global exception: {error_details}")
    return JSONResponse(
        status_code=500,
        content=error_details
    )

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/ping")
async def ping():
    """Simple test endpoint - always works"""
    return {
        "pong": "alive",
        "timestamp": str(datetime.now()),
        "model_loaded": model is not None,
        "model_loading_complete": model_loading_complete
    }

@app.get("/")
async def root():
    return {
        "message": "PramaanSetu AI Screening API is running",
        "status": "online",
        "model_loaded": model is not None,
        "model_loading_complete": model_loading_complete,
        "version": "1.0.0",
        "timestamp": str(datetime.now())
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "ready": model is not None,
        "model": "Smogy/SMOGY-Ai-images-detector",
        "mode": "local",
        "device": str(DEVICE),
        "model_loaded": model is not None,
        "model_loading_complete": model_loading_complete,
        "model_error": model_loading_error,
        "environment": "production" if PRODUCTION_URL else "development",
        "timestamp": str(datetime.now())
    }

@app.post("/api/detect")
async def detect_ai_generated_image(file: UploadFile = File(...)):
    """Analyze an uploaded image using the locally installed AI detector."""

    if model is None or processor is None:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Model not loaded",
                "message": "The AI detector is currently unavailable.",
                "status": "model_unavailable",
                "loading_complete": model_loading_complete,
                "error_details": model_loading_error
            },
        )

    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(415, detail="Please upload an image file.")

    # Read image
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(400, detail="The selected image is empty.")

    if len(image_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, detail="Images must be 10 MB or smaller.")

    # Open image
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("RGB")
    except Exception as error:
        print(f"Image decoding failed: {error!r}")
        raise HTTPException(400, detail="The uploaded file is not a valid image.")

    # Run local model
    try:
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
        print("Model predictions:", predictions)

    except Exception as error:
        print(f"Model inference failed: {error!r}")
        traceback.print_exc()
        raise HTTPException(500, detail="The AI detector failed while processing this image.")

    # Interpret model labels
    synthetic = next((p for p in predictions if any(word in p["label"].lower() for word in ("ai", "fake", "generated", "synthetic"))), None)
    real = next((p for p in predictions if any(word in p["label"].lower() for word in ("real", "human", "authentic"))), None)

    if synthetic is not None:
        risk = synthetic["score"]
    elif real is not None:
        risk = 1.0 - real["score"]
    else:
        raise HTTPException(502, detail={"message": "Model returned unrecognized labels.", "predictions": predictions})

    risk = max(0.0, min(1.0, float(risk)))

    return {
        "risk": risk,
        "percentage": round(risk * 100, 2),
        "label": "Likely AI-generated or manipulated" if risk >= 0.5 else "No strong AI-generation signal",
        "model": "Smogy/SMOGY-Ai-images-detector",
        "mode": "local",
        "device": str(DEVICE),
        "predictions": predictions,
        "disclaimer": "This is a screening signal, not proof of authenticity.",
    }

# ---------------------------------------------------------------------------
# Run directly
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )