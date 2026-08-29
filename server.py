import io
import os
import sys
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
print(f"📁 Current directory: {os.getcwd()}")
print(f"📁 Files: {os.listdir('.')}")


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


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def load_local_model():
    """Load the AI model with comprehensive error handling"""
    global processor, model, model_loading_error

    try:
        print(f"🔍 Looking for model in: {MODEL_DIR}")
        
        # Check if models directory exists
        if not MODEL_DIR.exists():
            error_msg = f"Model directory not found: {MODEL_DIR}"
            print(f"❌ {error_msg}")
            model_loading_error = error_msg
            return

        # Check if model files exist
        required_files = ["model.safetensors", "config.json", "preprocessor_config.json"]
        missing_files = []
        
        for file in required_files:
            if not (MODEL_DIR / file).exists():
                missing_files.append(file)
        
        if missing_files:
            error_msg = f"Missing model files: {missing_files}"
            print(f"❌ {error_msg}")
            print(f"📁 Files in model directory: {os.listdir(MODEL_DIR) if MODEL_DIR.exists() else 'Directory not found'}")
            model_loading_error = error_msg
            return

        print(f"✅ Loading local AI detector from: {MODEL_DIR}")
        print(f"⚙️  Using device: {DEVICE}")

        # Load processor
        print("📥 Loading processor...")
        processor = AutoImageProcessor.from_pretrained(
            str(MODEL_DIR),
            local_files_only=True,
        )
        print("✅ Processor loaded")

        # Load model
        print("📥 Loading model...")
        model = AutoModelForImageClassification.from_pretrained(
            str(MODEL_DIR),
            local_files_only=True,
        )
        print("✅ Model loaded")

        # Move to device
        print(f"📤 Moving model to {DEVICE}...")
        model.to(DEVICE)
        model.eval()
        print("✅ Model moved to device")

        print("✅ Local AI detector loaded successfully!")

    except Exception as e:
        error_msg = f"Model loading failed: {str(e)}"
        print(f"❌ {error_msg}")
        print(traceback.format_exc())
        model_loading_error = error_msg
        processor = None
        model = None


# ---------------------------------------------------------------------------
# FastAPI lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_: FastAPI):
    """Application lifespan - loads model on startup"""
    print("🚀 Starting up PramaanSetu AI Screening API...")
    
    try:
        load_local_model()
    except Exception as e:
        print(f"❌ Lifespan error: {e}")
        print(traceback.format_exc())
    
    # Print model status
    if model is not None:
        print("✅ Model loaded successfully!")
    else:
        print("⚠️  Model failed to load - API will return 503 for detection requests")
        if model_loading_error:
            print(f"📝 Error: {model_loading_error}")
    
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
# Global Exception Handler - Catches ALL errors
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch any exception and return detailed error info"""
    error_msg = {
        "error": str(exc),
        "error_type": type(exc).__name__,
        "traceback": traceback.format_exc(),
        "timestamp": str(datetime.now()),
        "url": str(request.url),
        "method": request.method
    }
    print(f"❌ Global exception: {error_msg}")
    return JSONResponse(
        status_code=500,
        content=error_msg
    )


# ---------------------------------------------------------------------------
# CORS - Updated for Production
# ---------------------------------------------------------------------------

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:8000",
]

if PRODUCTION_URL:
    allowed_origins.append(PRODUCTION_URL)
    if PRODUCTION_URL.startswith("http://"):
        allowed_origins.append(PRODUCTION_URL.replace("http://", "https://"))

allowed_origins.extend([
    "https://pramaan-setu.vercel.app",
    "https://*.vercel.app",
])

print(f"🔓 CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Ping Endpoint - Always works
# ---------------------------------------------------------------------------

@app.get("/ping")
async def ping():
    """Simple test endpoint that always works"""
    return {
        "pong": "alive",
        "timestamp": str(datetime.now()),
        "model_loaded": model is not None,
        "model_error": model_loading_error
    }


# ---------------------------------------------------------------------------
# Main Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    """Root endpoint"""
    try:
        return {
            "message": "PramaanSetu AI Screening API is running",
            "status": "online",
            "model_loaded": model is not None,
            "environment": "production" if PRODUCTION_URL else "development",
            "version": "1.0.0",
            "timestamp": str(datetime.now())
        }
    except Exception as e:
        return {
            "error": str(e),
            "traceback": traceback.format_exc()
        }


@app.get("/api/health")
def health():
    """Health check endpoint"""
    try:
        return {
            "status": "healthy" if model is not None else "degraded",
            "ready": model is not None,
            "model": "Smogy/SMOGY-Ai-images-detector",
            "mode": "local",
            "device": str(DEVICE),
            "model_loaded": model is not None,
            "model_status": "loaded" if model is not None else "not_loaded",
            "model_error": model_loading_error,
            "environment": "production" if PRODUCTION_URL else "development",
            "timestamp": str(datetime.now())
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }


# ---------------------------------------------------------------------------
# AI image detection - Full working version
# ---------------------------------------------------------------------------

@app.post("/api/detect")
async def detect_ai_generated_image(
    file: UploadFile = File(...)
):
    """
    Analyze an uploaded image using the locally installed AI detector.
    """

    if model is None or processor is None:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Model not loaded",
                "message": "The AI detector is currently unavailable. Please try again later.",
                "status": "model_unavailable",
                "error_details": model_loading_error
            },
        )

    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=415,
            detail="Please upload a JPG, PNG, or other image file.",
        )

    # Read image
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="The selected image is empty.")

    if len(image_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Images must be 10 MB or smaller.")

    # Open image
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("RGB")
    except Exception as error:
        print(f"Image decoding failed: {error!r}")
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        ) from error

    # Run local model
    try:
        inputs = processor(images=image, return_tensors="pt")
        inputs = {key: value.to(DEVICE) for key, value in inputs.items()}

        with torch.inference_mode():
            outputs = model(**inputs)

        probabilities = torch.softmax(outputs.logits, dim=-1)[0]
        predictions = []

        for index, score in enumerate(probabilities):
            label = model.config.id2label.get(index, str(index))
            predictions.append({"label": str(label), "score": float(score)})

        predictions.sort(key=lambda item: item["score"], reverse=True)
        print("Model predictions:", predictions)

    except Exception as error:
        print(f"Local model inference failed: {error!r}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail="The local AI detector failed while reviewing this image.",
        ) from error

    # Interpret model labels
    synthetic = None
    real = None

    for prediction in predictions:
        label_lower = prediction["label"].lower()

        if synthetic is None and any(word in label_lower for word in ("ai", "fake", "generated", "synthetic")):
            synthetic = prediction

        if real is None and any(word in label_lower for word in ("real", "human", "authentic")):
            real = prediction

    # Calculate AI-generation risk
    if synthetic is not None:
        risk = synthetic["score"]
    elif real is not None:
        risk = 1.0 - real["score"]
    else:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "The model returned labels this API does not recognise.",
                "predictions": predictions,
            },
        )

    risk = max(0.0, min(1.0, float(risk)))

    if risk >= 0.50:
        label = "Likely AI-generated or manipulated"
    else:
        label = "No strong AI-generation signal"

    return {
        "risk": risk,
        "score": risk,
        "percentage": round(risk * 100, 2),
        "label": label,
        "model": "Smogy/SMOGY-Ai-images-detector",
        "mode": "local",
        "device": str(DEVICE),
        "predictions": predictions,
        "disclaimer": (
            "This is a screening signal, not proof that a document "
            "or image is authentic."
        ),
    }


# ---------------------------------------------------------------------------
# Run directly
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )