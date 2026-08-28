import io
import os
from contextlib import asynccontextmanager
from pathlib import Path

import torch
from PIL import Image
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoImageProcessor, AutoModelForImageClassification


# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

load_dotenv()


# ---------------------------------------------------------------------------
# Model configuration
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models" / "ai-detector"

MAX_UPLOAD_BYTES = 10 * 1024 * 1024

# Automatically use GPU if PyTorch detects CUDA.
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ---------------------------------------------------------------------------
# Global model objects
# ---------------------------------------------------------------------------

processor = None
model = None


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def load_local_model():
    global processor, model

    if not MODEL_DIR.exists():
        raise RuntimeError(
            f"Local model directory was not found:\n{MODEL_DIR}"
        )

    print(f"Loading local AI detector from: {MODEL_DIR}")
    print(f"Using device: {DEVICE}")

    processor = AutoImageProcessor.from_pretrained(
        str(MODEL_DIR),
        local_files_only=True,
    )

    model = AutoModelForImageClassification.from_pretrained(
        str(MODEL_DIR),
        local_files_only=True,
    )

    model.to(DEVICE)
    model.eval()

    print("Local AI detector loaded successfully.")


# ---------------------------------------------------------------------------
# FastAPI lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_: FastAPI):
    load_local_model()
    yield


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="PramaanSetu AI Screening",
    docs_url=None,
    redoc_url=None,
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "ready": model is not None,
        "model": "Smogy/SMOGY-Ai-images-detector",
        "mode": "local",
        "device": str(DEVICE),
    }


# ---------------------------------------------------------------------------
# AI image detection
# ---------------------------------------------------------------------------

@app.post("/api/detect")
async def detect_ai_generated_image(
    file: UploadFile = File(...)
):
    """
    Analyze an uploaded image using the locally installed AI detector.

    This returns a screening signal and must not be treated as proof
    that an image is authentic or AI-generated.
    """

    if model is None or processor is None:
        raise HTTPException(
            status_code=503,
            detail="The local AI detector is not loaded yet.",
        )

    # -----------------------------------------------------------------------
    # Validate file type
    # -----------------------------------------------------------------------

    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):
        raise HTTPException(
            status_code=415,
            detail="Please upload a JPG, PNG, or other image file.",
        )

    # -----------------------------------------------------------------------
    # Read image
    # -----------------------------------------------------------------------

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The selected image is empty.",
        )

    if len(image_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Images must be 10 MB or smaller.",
        )

    # -----------------------------------------------------------------------
    # Open image
    # -----------------------------------------------------------------------

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("RGB")
    except Exception as error:
        print(f"Image decoding failed: {error!r}")

        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        ) from error

    # -----------------------------------------------------------------------
    # Run local model
    # -----------------------------------------------------------------------

    try:
        inputs = processor(
            images=image,
            return_tensors="pt",
        )

        # Move tensors to CPU/GPU.
        inputs = {
            key: value.to(DEVICE)
            for key, value in inputs.items()
        }

        with torch.inference_mode():
            outputs = model(**inputs)

        probabilities = torch.softmax(
            outputs.logits,
            dim=-1,
        )[0]

        predictions = []

        for index, score in enumerate(probabilities):
            label = model.config.id2label.get(
                index,
                str(index),
            )

            predictions.append(
                {
                    "label": str(label),
                    "score": float(score),
                }
            )

        # Highest-confidence prediction first.
        predictions.sort(
            key=lambda item: item["score"],
            reverse=True,
        )

        print("Model predictions:", predictions)

    except Exception as error:
        print(f"Local model inference failed: {error!r}")

        raise HTTPException(
            status_code=500,
            detail="The local AI detector failed while reviewing this image.",
        ) from error

    # -----------------------------------------------------------------------
    # Interpret model labels
    # -----------------------------------------------------------------------

    synthetic = None
    real = None

    for prediction in predictions:
        label_lower = prediction["label"].lower()

        if synthetic is None and any(
            word in label_lower
            for word in (
                "ai",
                "fake",
                "generated",
                "synthetic",
            )
        ):
            synthetic = prediction

        if real is None and any(
            word in label_lower
            for word in (
                "real",
                "human",
                "authentic",
            )
        ):
            real = prediction

    # -----------------------------------------------------------------------
    # Calculate AI-generation risk
    # -----------------------------------------------------------------------

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

    # Keep the value safely within 0-1.
    risk = max(0.0, min(1.0, float(risk)))

    # -----------------------------------------------------------------------
    # User-facing result
    # -----------------------------------------------------------------------

    if risk >= 0.50:
        label = "Likely AI-generated or manipulated"
    else:
        label = "No strong AI-generation signal"

    # -----------------------------------------------------------------------
    # Response
    # -----------------------------------------------------------------------

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
# Run directly with:
#
#     python server.py
#
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
    )