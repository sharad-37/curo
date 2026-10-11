# ml-service/main.py
import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np

from model_trainer import load_or_train_model

# Global Model Reference
model_pipeline = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Modern FastAPI async lifespan event handler for startup/shutdown."""
    global model_pipeline
    model_pipeline = load_or_train_model()
    yield

app = FastAPI(
    title="Curo ML Financial Intelligence Engine",
    version="1.0.0",
    description="Transaction categorization, confidence scoring, and forecasting microservice.",
    lifespan=lifespan
)

# Enable CORS for Next.js App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# SCHEMAS (Pydantic V2 Compatible)
# -----------------------------------------------------------------------------

class TransactionRequest(BaseModel):
    description: str = Field(..., json_schema_extra={"example": "UPI-SWIGGY-REST-PAY-BANGALORE"})
    merchant: Optional[str] = Field(None, json_schema_extra={"example": "Swiggy"})
    amount: float = Field(..., json_schema_extra={"example": 340.0})
    type: str = Field("DEBIT", json_schema_extra={"example": "DEBIT"})

class CategorizeResponse(BaseModel):
    category_slug: str
    confidence_score: float
    is_low_confidence: bool

class BatchCategorizeRequest(BaseModel):
    transactions: List[TransactionRequest]

class BatchCategorizeResponse(BaseModel):
    predictions: List[CategorizeResponse]

class ForecastRequest(BaseModel):
    current_spent: float
    days_elapsed: int
    total_days_in_month: int
    historical_avg_monthly_spent: Optional[float] = None

class ForecastResponse(BaseModel):
    projected_month_end_spent: float
    daily_run_rate: float
    risk_level: str  # "LOW", "MODERATE", "HIGH"
    confidence_interval_low: float
    confidence_interval_high: float

# -----------------------------------------------------------------------------
# ENDPOINTS
# -----------------------------------------------------------------------------

@app.get("/")
def root():
    return {"status": "ok", "service": "Curo ML Service", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Curo ML Service", "model_loaded": model_pipeline is not None}

@app.post("/api/v1/categorize", response_model=CategorizeResponse)
def predict_category(req: TransactionRequest):
    if model_pipeline is None:
        raise HTTPException(status_code=500, detail="ML model is not initialized.")

    text_input = f"{req.merchant or ''} {req.description}".strip()

    # Predict class and probabilities
    probabilities = model_pipeline.predict_proba([text_input])[0]
    classes = model_pipeline.classes_
    best_idx = np.argmax(probabilities)

    category_slug = str(classes[best_idx])
    confidence_score = float(probabilities[best_idx])

    # Rule-override for income credits
    if req.type == "CREDIT" and category_slug != "income":
        category_slug = "income"
        confidence_score = 0.90

    return CategorizeResponse(
        category_slug=category_slug,
        confidence_score=round(confidence_score, 4),
        is_low_confidence=confidence_score < 0.60
    )

@app.post("/api/v1/categorize-batch", response_model=BatchCategorizeResponse)
def predict_category_batch(req: BatchCategorizeRequest):
    results = [predict_category(tx) for tx in req.transactions]
    return BatchCategorizeResponse(predictions=results)

@app.post("/api/v1/forecast", response_model=ForecastResponse)
def forecast_spending(req: ForecastRequest):
    if req.days_elapsed <= 0:
        daily_rate = 0.0
    else:
        daily_rate = req.current_spent / req.days_elapsed

    remaining_days = max(0, req.total_days_in_month - req.days_elapsed)
    projected = req.current_spent + (daily_rate * remaining_days)

    # Risk Assessment
    risk_level = "LOW"
    if req.historical_avg_monthly_spent and req.historical_avg_monthly_spent > 0:
        ratio = projected / req.historical_avg_monthly_spent
        if ratio > 1.25:
            risk_level = "HIGH"
        elif ratio > 1.05:
            risk_level = "MODERATE"

    interval_margin = daily_rate * np.sqrt(remaining_days) * 1.5

    return ForecastResponse(
        projected_month_end_spent=round(projected, 2),
        daily_run_rate=round(daily_rate, 2),
        risk_level=risk_level,
        confidence_interval_low=max(round(req.current_spent, 2), round(projected - interval_margin, 2)),
        confidence_interval_high=round(projected + interval_margin, 2)
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)