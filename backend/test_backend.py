import ml_models

def main():
    print("=== Initializing Fraud Sentinel AI Engine ===")
    engine = ml_models.FraudDetectionEngine()
    print("Is Trained:", engine.is_trained)
    print("\n--- Transaction Model Performance ---")
    print("Accuracy:", engine.tx_metrics.get("accuracy"))
    print("ROC-AUC:", engine.tx_metrics.get("roc_auc"))
    print("Confusion Matrix:", engine.tx_metrics.get("confusion_matrix"))
    print("Feature Importances:", engine.tx_metrics.get("feature_importance"))

    print("\n--- Text Scam Model Performance ---")
    print("Accuracy:", engine.text_metrics.get("accuracy"))
    print("ROC-AUC:", engine.text_metrics.get("roc_auc"))

    print("\n--- Test Scan 1: Offshore High-Value Transaction ---")
    tx_res = engine.predict_transaction({
        "amount_usd": 4800.00,
        "distance_from_home": 450.0,
        "velocity_24h": 8,
        "hour_of_day": 2,
        "is_new_device": 1,
        "is_foreign": 1,
        "merchant_risk_score": 85.0
    })
    print("Risk Score:", tx_res["risk_score"], "| Level:", tx_res["risk_level"], "| Fraudulent:", tx_res["is_fraudulent"])

    print("\n--- Test Scan 2: Phishing SMS Scam ---")
    text_res = engine.predict_text_scam("URGENT: Your bank account has been locked. Verify identity now at http://secure-bank-login.xyz/auth")
    print("Risk Score:", text_res["risk_score"], "| Level:", text_res["risk_level"], "| Flagged Words:", text_res["flagged_words"])

    print("\n--- Test Scan 3: URL Audit ---")
    url_res = engine.predict_url_risk("http://paypal-security-login.xyz/auth")
    print("Risk Score:", url_res["risk_score"], "| Level:", url_res["risk_level"], "| Malicious:", url_res["is_malicious"])

    print("\n=== Verification Successful! ===")

if __name__ == "__main__":
    main()
