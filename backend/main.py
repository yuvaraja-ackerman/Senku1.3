import random
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_models import FraudDetectionEngine

app = FastAPI(
    title="Fraud Sentinel AI - Detection Engine API",
    description="Multi-Modal Machine Learning Fraud & Scam Detection Engine",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML Engine
engine = FraudDetectionEngine()

# Pydantic Schemas
class TransactionRequest(BaseModel):
    amount_usd: float
    distance_from_home: float
    velocity_24h: int
    hour_of_day: int
    is_new_device: int
    is_foreign: int
    merchant_risk_score: float

class TextScamRequest(BaseModel):
    text: str

class UrlRiskRequest(BaseModel):
    url: str

class MultiModalRequest(BaseModel):
    transaction: Optional[TransactionRequest] = None
    text: Optional[str] = None
    url: Optional[str] = None

class CustomRule(BaseModel):
    id: str
    name: str
    field: str
    condition: str
    value: str | float | int
    risk_addition: int
    enabled: bool

# Routes
@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Fraud Sentinel AI Engine",
        "models_loaded": engine.is_trained
    }

@app.post("/api/detect/transaction")
def detect_transaction(req: TransactionRequest):
    return engine.predict_transaction(req.model_dump())

@app.post("/api/detect/text")
def detect_text_scam(req: TextScamRequest):
    return engine.predict_text_scam(req.text)

@app.post("/api/detect/url")
def detect_url_risk(req: UrlRiskRequest):
    return engine.predict_url_risk(req.url)

@app.post("/api/detect/multimodal")
def detect_multimodal(req: MultiModalRequest):
    tx_res = engine.predict_transaction(req.transaction.model_dump()) if req.transaction else None
    text_res = engine.predict_text_scam(req.text) if req.text else None
    url_res = engine.predict_url_risk(req.url) if req.url else None

    scores = []
    if tx_res: scores.append(tx_res["risk_score"])
    if text_res: scores.append(text_res["risk_score"])
    if url_res: scores.append(url_res["risk_score"])

    combined_score = max(scores) if scores else 0
    risk_level = "LOW"
    if combined_score >= 80: risk_level = "CRITICAL"
    elif combined_score >= 60: risk_level = "HIGH"
    elif combined_score >= 35: risk_level = "MEDIUM"

    return {
        "overall_risk_score": combined_score,
        "overall_risk_level": risk_level,
        "transaction_analysis": tx_res,
        "text_scam_analysis": text_res,
        "url_analysis": url_res
    }

@app.get("/api/models/info")
def get_model_info():
    return {
        "transaction_model": {
            "type": "Random Forest Ensemble (100 Trees)",
            "metrics": engine.tx_metrics
        },
        "text_scam_model": {
            "type": "TF-IDF Vectorizer + Logistic Regression",
            "metrics": engine.text_metrics
        }
    }

@app.get("/api/analytics")
def get_live_analytics():
    return {
        "total_scans": 142850,
        "frauds_blocked": 12840,
        "fraud_rate_pct": 8.99,
        "recent_threats": [
            {"id": "TH-9021", "type": "Offshore High Wire", "score": 94, "level": "CRITICAL", "timestamp": "2 mins ago", "location": "Lagos, NG"},
            {"id": "TH-9022", "type": "IRS Phishing SMS", "score": 88, "level": "CRITICAL", "timestamp": "5 mins ago", "location": "Miami, US"},
            {"id": "TH-9023", "type": "Typosquat PayPal URL", "score": 76, "level": "HIGH", "timestamp": "12 mins ago", "location": "Bucharest, RO"},
            {"id": "TH-9024", "type": "Crypto Giveaway Trap", "score": 91, "level": "CRITICAL", "timestamp": "18 mins ago", "location": "London, UK"},
            {"id": "TH-9025", "type": "Velocity Spike Card Test", "score": 68, "level": "HIGH", "timestamp": "24 mins ago", "location": "Toronto, CA"}
        ],
        "threat_categories": [
            {"category": "Financial Fraud", "count": 5420},
            {"category": "SMS Phishing (Smishing)", "count": 3890},
            {"category": "URL Impersonation", "count": 2100},
            {"category": "Crypto Giveaways", "count": 1430}
        ]
    }

@app.get("/api/rules")
def get_custom_rules():
    return engine.custom_rules

@app.post("/api/rules")
def update_custom_rule(rule: CustomRule):
    for i, r in enumerate(engine.custom_rules):
        if r["id"] == rule.id:
            engine.custom_rules[i] = rule.model_dump()
            return {"status": "success", "rule": rule}
    engine.custom_rules.append(rule.model_dump())
    return {"status": "created", "rule": rule}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
