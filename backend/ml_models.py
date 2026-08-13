import numpy as np
import pandas as pd
import re
import urllib.parse
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_recall_fscore_support, roc_auc_score
from sklearn.model_selection import train_test_split

class FraudDetectionEngine:
    def __init__(self):
        self.is_trained = False
        self.tx_model = None
        self.tx_metrics = {}
        self.text_vectorizer = None
        self.text_model = None
        self.text_metrics = {}
        self.custom_rules = [
            {"id": "rule_1", "name": "Offshore High Amount Flag", "field": "amount_usd", "condition": ">", "value": 3000, "risk_addition": 35, "enabled": True},
            {"id": "rule_2", "name": "Midnight New Device Spike", "field": "is_new_device", "condition": "==", "value": 1, "risk_addition": 25, "enabled": True},
            {"id": "rule_3", "name": "Urgent Crypto Keyword Block", "field": "text", "condition": "contains", "value": "crypto gift", "risk_addition": 45, "enabled": True},
            {"id": "rule_4", "name": "Suspicious TLD Warning", "field": "url", "condition": "contains", "value": ".xyz", "risk_addition": 30, "enabled": True}
        ]
        self._train_models()

    def _generate_synthetic_transactions(self, n_samples=2000):
        np.random.seed(42)
        amount = np.random.exponential(scale=120, size=n_samples)
        distance_from_home = np.random.exponential(scale=15, size=n_samples)
        velocity_24h = np.random.poisson(lam=3, size=n_samples)
        hour_of_day = np.random.randint(0, 24, size=n_samples)
        is_new_device = np.random.binomial(1, 0.15, size=n_samples)
        is_foreign = np.random.binomial(1, 0.08, size=n_samples)
        merchant_risk_score = np.random.beta(a=2, b=8, size=n_samples) * 100

        # Fraud probability logic
        z = (
            (amount > 500) * 1.5 +
            (distance_from_home > 80) * 1.8 +
            (velocity_24h > 7) * 2.1 +
            ((hour_of_day >= 1) & (hour_of_day <= 5)) * 1.2 +
            (is_new_device == 1) * 1.4 +
            (is_foreign == 1) * 2.2 +
            (merchant_risk_score > 70) * 2.5 - 3.5
        )
        prob = 1 / (1 + np.exp(-z))
        is_fraud = (np.random.binomial(1, prob) == 1).astype(int)

        df = pd.DataFrame({
            "amount_usd": np.round(amount, 2),
            "distance_from_home": np.round(distance_from_home, 1),
            "velocity_24h": velocity_24h,
            "hour_of_day": hour_of_day,
            "is_new_device": is_new_device,
            "is_foreign": is_foreign,
            "merchant_risk_score": np.round(merchant_risk_score, 1),
            "is_fraud": is_fraud
        })
        return df

    def _generate_synthetic_text_data(self):
        scam_texts = [
            "URGENT: Your bank account has been locked. Verify identity now at http://secure-bank-login.xyz/auth or lose access forever!",
            "CONGRATULATIONS! You won $10,000 in Bitcoin. Claim immediately by sending 0.01 BTC to this wallet for processing fee.",
            "FINAL WARNING: Internal Revenue Service tax lawsuit filed against you. Call immediately to settle outstanding payment.",
            "PayPal Security Alert: Unauthorized sign-in detected from IP 192.168.1.1. Confirm credentials here: http://paypal-verify-user.online",
            "Mom I lost my phone and this is my new temporary number. Please transfer $500 to my account for urgent hospital bills.",
            "Package delivery failure: USPS notice #9482. Pay $2.99 re-delivery fee at http://usps-redelivery-tracking.top",
            "Exclusive job opportunity! Earn $5000/week working from home. No experience needed. Wire $100 for starter kit.",
            "Crypto investment double guarantee! Send Ethereum now and receive 2x back instantly.",
            "Account suspension notice: Netflix payment failed. Update card details within 24 hours at http://netflix-billing-update.info",
            "Security code alert: Do not share! Your WhatsApp code is 849-204. Enter code at link if you didn't request this."
        ] * 40

        legit_texts = [
            "Hey are we still meeting for lunch today at 1pm at the downtown cafe?",
            "Your appointment with Dr. Smith is confirmed for tomorrow at 10:00 AM. Reply C to confirm.",
            "Hi John, attached is the monthly sales report for Q3. Let me know if you have any questions.",
            "Your Amazon order #112-94827-201 has shipped and will arrive by Thursday.",
            "Reminder: Team sync meeting is scheduled for 3:00 PM in Conference Room B.",
            "Thanks for your order! Your receipt from Target is ready. Total amount $48.20.",
            "Dad, can you pick up milk and bread on your way home from work?",
            "Your flight to Chicago United Airlines UA492 is boarding at Gate B12.",
            "Verification code for your account: 948201. Expires in 10 minutes.",
            "Hi team, code review for PR #402 is complete. Ready to merge."
        ] * 40

        texts = scam_texts + legit_texts
        labels = [1] * len(scam_texts) + [0] * len(legit_texts)
        return texts, labels

    def _train_models(self):
        # 1. Train Transaction Fraud Classifier
        df_tx = self._generate_synthetic_transactions(n_samples=2500)
        X_tx = df_tx.drop(columns=["is_fraud"])
        y_tx = df_tx["is_fraud"]

        X_train, X_test, y_train, y_test = train_test_split(X_tx, y_tx, test_size=0.25, random_state=42, stratify=y_tx)
        
        self.tx_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        self.tx_model.fit(X_train, y_train)

        y_pred = self.tx_model.predict(X_test)
        y_prob = self.tx_model.predict_proba(X_test)[:, 1]

        cm = confusion_matrix(y_test, y_pred)
        prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
        auc = roc_auc_score(y_test, y_prob)

        feature_names = list(X_tx.columns)
        importances = dict(zip(feature_names, [round(float(v), 4) for v in self.tx_model.feature_importances_]))

        self.tx_metrics = {
            "accuracy": round(float((y_pred == y_test).mean()), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "roc_auc": round(float(auc), 4),
            "confusion_matrix": cm.tolist(), # [[TN, FP], [FN, TP]]
            "feature_importance": importances,
            "total_samples": len(df_tx)
        }

        # 2. Train Text Phishing Classifier
        texts, labels = self._generate_synthetic_text_data()
        X_text_train, X_text_test, y_text_train, y_text_test = train_test_split(texts, labels, test_size=0.25, random_state=42, stratify=labels)

        self.text_vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
        X_vec_train = self.text_vectorizer.fit_transform(X_text_train)
        X_vec_test = self.text_vectorizer.transform(X_text_test)

        self.text_model = LogisticRegression(C=1.0)
        self.text_model.fit(X_vec_train, y_text_train)

        y_text_pred = self.text_model.predict(X_vec_test)
        y_text_prob = self.text_model.predict_proba(X_vec_test)[:, 1]

        cm_text = confusion_matrix(y_text_test, y_text_pred)
        prec_t, rec_t, f1_t, _ = precision_recall_fscore_support(y_text_test, y_text_pred, average='binary')
        auc_t = roc_auc_score(y_text_test, y_text_prob)

        self.text_metrics = {
            "accuracy": round(float((y_text_pred == y_text_test).mean()), 4),
            "precision": round(float(prec_t), 4),
            "recall": round(float(rec_t), 4),
            "f1_score": round(float(f1_t), 4),
            "roc_auc": round(float(auc_t), 4),
            "confusion_matrix": cm_text.tolist(),
            "total_samples": len(texts)
        }

        self.is_trained = True

    def predict_transaction(self, tx_data: dict):
        # Data preparation
        features = [
            tx_data.get("amount_usd", 50.0),
            tx_data.get("distance_from_home", 5.0),
            tx_data.get("velocity_24h", 1),
            tx_data.get("hour_of_day", 14),
            tx_data.get("is_new_device", 0),
            tx_data.get("is_foreign", 0),
            tx_data.get("merchant_risk_score", 15.0)
        ]
        
        prob = self.tx_model.predict_proba([features])[0][1]
        base_score = int(prob * 100)

        # Explainability & Risk Drivers
        risk_factors = []
        if tx_data.get("amount_usd", 0) > 1000:
            risk_factors.append({"factor": "High Transaction Amount (> $1,000)", "weight": "+25% risk", "severity": "high"})
        elif tx_data.get("amount_usd", 0) > 400:
            risk_factors.append({"factor": "Above-Average Transaction Amount", "weight": "+10% risk", "severity": "medium"})

        if tx_data.get("distance_from_home", 0) > 50:
            risk_factors.append({"factor": "Unusual Location Distance (> 50 miles)", "weight": "+20% risk", "severity": "high"})

        if tx_data.get("is_foreign", 0) == 1:
            risk_factors.append({"factor": "Cross-Border / Foreign Transaction", "weight": "+30% risk", "severity": "critical"})

        if tx_data.get("is_new_device", 0) == 1:
            risk_factors.append({"factor": "Unrecognized / New Device Signature", "weight": "+15% risk", "severity": "medium"})

        if tx_data.get("velocity_24h", 0) >= 5:
            risk_factors.append({"factor": "Rapid Velocity Spike (Multiple attempts in 24h)", "weight": "+20% risk", "severity": "high"})

        hour = tx_data.get("hour_of_day", 12)
        if 1 <= hour <= 5:
            risk_factors.append({"factor": "Off-Hours Midnight Transaction Window", "weight": "+10% risk", "severity": "low"})

        if tx_data.get("merchant_risk_score", 0) > 60:
            risk_factors.append({"factor": "High Risk Merchant Category Rating", "weight": "+20% risk", "severity": "high"})

        # Apply Custom Rules
        rule_hits = []
        rule_added_risk = 0
        for rule in self.custom_rules:
            if not rule.get("enabled"): continue
            field = rule["field"]
            val = tx_data.get(field)
            if val is not None:
                cond = rule["condition"]
                target = rule["value"]
                triggered = False
                if cond == ">" and val > target: triggered = True
                elif cond == ">=" and val >= target: triggered = True
                elif cond == "==" and val == target: triggered = True
                if triggered:
                    rule_hits.append(rule["name"])
                    rule_added_risk += rule["risk_addition"]

        final_score = min(100, base_score + rule_added_risk)

        risk_level = "LOW"
        if final_score >= 80: risk_level = "CRITICAL"
        elif final_score >= 60: risk_level = "HIGH"
        elif final_score >= 35: risk_level = "MEDIUM"

        return {
            "risk_score": final_score,
            "base_ml_score": base_score,
            "risk_level": risk_level,
            "confidence": round(float(abs(prob - 0.5) * 2 * 100), 1),
            "is_fraudulent": final_score >= 50,
            "risk_factors": risk_factors,
            "triggered_rules": rule_hits
        }

    def predict_text_scam(self, text: str):
        if not text or len(text.strip()) == 0:
            return {"risk_score": 0, "risk_level": "LOW", "confidence": 100, "flagged_words": [], "red_flags": []}

        vec = self.text_vectorizer.transform([text])
        prob = self.text_model.predict_proba(vec)[0][1]
        base_score = int(prob * 100)

        red_flags = []
        flagged_words = []

        keywords_urgent = ["urgent", "immediately", "locked", "lose access", "final warning", "action required", "within 24 hours", "now"]
        keywords_financial = ["bank", "paypal", "bitcoin", "btc", "wire", "transfer", "tax", "irs", "invoice", "refund", "fee", "wallet"]
        keywords_scam_tricks = ["won", "congratulations", "free", "claim", "doubled", "hospital", "temporary number", "lottery", "gift card"]

        text_lower = text.lower()
        for kw in keywords_urgent:
            if kw in text_lower:
                red_flags.append(f"Urgent pressure tactic detected ('{kw}')")
                flagged_words.append(kw)

        for kw in keywords_financial:
            if kw in text_lower:
                red_flags.append(f"Financial / credential target keyword ('{kw}')")
                flagged_words.append(kw)

        for kw in keywords_scam_tricks:
            if kw in text_lower:
                red_flags.append(f"High-probability scam hook ('{kw}')")
                flagged_words.append(kw)

        # URL presence check in text
        urls = re.findall(r'https?://[^\s]+', text)
        if urls:
            red_flags.append(f"Contains embedded link: {urls[0]}")
            for u in urls:
                if any(bad in u for bad in [".xyz", ".top", ".info", ".online", ".site", "login", "verify"]):
                    base_score = max(base_score, 85)
                    red_flags.append(f"High-risk domain structure in link ({u})")

        # Custom rules check for text
        rule_hits = []
        for rule in self.custom_rules:
            if not rule.get("enabled"): continue
            if rule["field"] == "text" and rule["condition"] == "contains":
                if rule["value"].lower() in text_lower:
                    rule_hits.append(rule["name"])
                    base_score = min(100, base_score + rule["risk_addition"])

        final_score = min(100, base_score)
        risk_level = "LOW"
        if final_score >= 80: risk_level = "CRITICAL"
        elif final_score >= 60: risk_level = "HIGH"
        elif final_score >= 35: risk_level = "MEDIUM"

        return {
            "risk_score": final_score,
            "risk_level": risk_level,
            "confidence": round(float(abs(prob - 0.5) * 2 * 100), 1),
            "is_scam": final_score >= 50,
            "flagged_words": list(set(flagged_words)),
            "red_flags": red_flags,
            "triggered_rules": rule_hits
        }

    def predict_url_risk(self, url: str):
        if not url:
            return {"risk_score": 0, "risk_level": "LOW", "audit_checks": []}

        score = 10
        audit_checks = []

        url_clean = url.strip()
        if not url_clean.startswith("http://") and not url_clean.startswith("https://"):
            url_clean = "http://" + url_clean

        parsed = urllib.parse.urlparse(url_clean)
        domain = parsed.netloc.lower()

        if not parsed.scheme or parsed.scheme == "http":
            score += 20
            audit_checks.append({"title": "Insecure HTTP Protocol", "status": "FAIL", "detail": "Connection is unencrypted HTTP."})
        else:
            audit_checks.append({"title": "SSL Encrypted HTTPS", "status": "PASS", "detail": "Valid HTTPS scheme present."})

        # Check suspicious TLDs
        suspicious_tlds = [".xyz", ".top", ".info", ".online", ".site", ".work", ".click", ".zip", ".mov"]
        if any(domain.endswith(tld) for tld in suspicious_tlds):
            score += 35
            audit_checks.append({"title": "High-Risk Top Level Domain (TLD)", "status": "FAIL", "detail": f"Domain ends with suspicious TLD ({domain.split('.')[-1]})."})
        else:
            audit_checks.append({"title": "Reputable TLD Check", "status": "PASS", "detail": "Standard domain extension."})

        # Typosquatting / Brand impersonation check
        impersonated_brands = ["paypal", "amazon", "apple", "netflix", "wellsfargo", "chase", "binance", "coinbase", "usps", "meta"]
        found_brand = None
        for brand in impersonated_brands:
            if brand in domain and not (domain.endswith(f"{brand}.com") or domain.endswith(f"{brand}.org") or domain == f"{brand}.com"):
                found_brand = brand
                score += 45
                audit_checks.append({"title": "Brand Impersonation / Typosquatting", "status": "FAIL", "detail": f"Domain mimics legitimate brand '{brand}'."})
                break
        if not found_brand:
            audit_checks.append({"title": "Brand Authenticity Check", "status": "PASS", "detail": "No obvious brand spoofing detected."})

        # Entropy & Subdomain depth check
        subdomains = domain.split(".")
        if len(subdomains) > 3:
            score += 20
            audit_checks.append({"title": "Excessive Subdomain Depth", "status": "WARN", "detail": f"Contains {len(subdomains)} subdomain layers."})

        if any(kw in url_clean.lower() for kw in ["login", "verify", "secure", "auth", "account", "update-billing"]):
            score += 20
            audit_checks.append({"title": "Phishing Keyword Target", "status": "FAIL", "detail": "URL contains sensitive auth keyword targets."})

        final_score = min(100, score)
        risk_level = "LOW"
        if final_score >= 80: risk_level = "CRITICAL"
        elif final_score >= 60: risk_level = "HIGH"
        elif final_score >= 35: risk_level = "MEDIUM"

        return {
            "url": url,
            "domain": domain,
            "risk_score": final_score,
            "risk_level": risk_level,
            "is_malicious": final_score >= 50,
            "audit_checks": audit_checks
        }
