# ml-service/model_trainer.py
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

MODEL_FILE = "curo_categorizer.joblib"

# Training Dataset: Real Indian Bank Statement Narrations
TRAINING_DATA = [
    # Food & Dining
    ("UPI-SWIGGY-REST-PAY-BANGALORE", "food-dining"),
    ("UPI-ZOMATO-FOOD-DELIVERY-GURGAON", "food-dining"),
    ("STARBUCKS-COFFEE-INDIRANAGAR", "food-dining"),
    ("THIRD-WAVE-COFFEE-KORAMANGALA", "food-dining"),
    ("MCDONALDS-INDIA-PAYMENT", "food-dining"),
    ("DOMINOS-PIZZA-ONLINE", "food-dining"),
    ("KFC-RESTAURANT-PAY", "food-dining"),
    ("BURGER-KING-DELHI", "food-dining"),
    ("CHAI-POINT-OFFICE", "food-dining"),
    ("CHAAYOS-TEATIME", "food-dining"),
    ("HALDIRAMS-DELHI-NCR", "food-dining"),

    # Groceries
    ("UPI-ZEPTO-BANGALORE-GROCERY", "groceries"),
    ("UPI-BLINKIT-DELIVERY-BLR", "groceries"),
    ("SWIGGY-INSTAMART-SUPERMARKET", "groceries"),
    ("BIGBASKET-ONLINE-ORDER", "groceries"),
    ("MORE-RETAIL-SUPERMARKET", "groceries"),
    ("NATURES-BASKET-RETAIL", "groceries"),
    ("D-MART-RETAIL-STORE", "groceries"),
    ("RELIANCE-SMART-GROCERY", "groceries"),
    ("LOCAL-VEG-VENDOR-UPI", "groceries"),

    # Transport & Commute
    ("UPI-UBER-TRIP-BANGALORE", "transport"),
    ("UPI-OLA-CABS-RIDE", "transport"),
    ("UPI-NAMMA-YATRI-AUTO", "transport"),
    ("RAPIDO-BIKE-TAXI", "transport"),
    ("HPCL-PETROL-PUMP", "transport"),
    ("BPCL-FUEL-STATION", "transport"),
    ("SHELL-PETROL-BANGALORE", "transport"),
    ("IRCTC-RAILWAY-TICKET", "transport"),
    ("BANGALORE-METRO-RECHARGE", "transport"),

    # Housing & Rent
    ("UPI-NOBROKER-RENT-PAYMENT", "housing"),
    ("CRED-RENT-PAY-HOUSING", "housing"),
    ("LANDLORD-MONTHLY-RENT", "housing"),
    ("APARTMENT-MAINTENANCE-FEE", "housing"),

    # Utilities & Bills
    ("AIRTEL-BROADBAND-BILL", "utilities"),
    ("JIO-RECHARGE-ONLINE", "utilities"),
    ("BESCOM-ELECTRICITY-BILL", "utilities"),
    ("TATA-PLAY-DTH-RECHARGE", "utilities"),
    ("ADANI-GAS-BILL-PAYMENT", "utilities"),

    # Subscriptions & Entertainment
    ("CARD-NETFLIX-DIGITAL-SUBSCRIPTION", "subscriptions"),
    ("UPI-SPOTIFY-INDIA-MONTHLY", "subscriptions"),
    ("AMAZON-PRIME-MEMBERSHIP", "subscriptions"),
    ("DISNEY-HOTSTAR-SUBSCRIPTION", "subscriptions"),
    ("YOUTUBE-PREMIUM-DIGITAL", "subscriptions"),
    ("CULTFIT-GYM-MEMBERSHIP", "subscriptions"),
    ("APPLE-SERVICES-ICLOUD", "subscriptions"),

    # Shopping
    ("AMAZON-PAY-IN-RETAIL-ORDER", "shopping"),
    ("FLIPKART-ONLINE-SHOPPING", "shopping"),
    ("MYNTRA-FASHION-ORDER", "shopping"),
    ("ZARA-INDIA-RETAIL", "shopping"),
    ("DECATHLON-SPORTS-INDIA", "shopping"),
    ("UNIQLO-CLOTHING-STORE", "shopping"),

    # Healthcare
    ("APOLLO-PHARMACY-MEDICINE", "healthcare"),
    ("1MG-ONLINE-MEDICINE", "healthcare"),
    ("PRACTO-DOCTOR-CONSULTATION", "healthcare"),
    ("MEDPLUS-PHARMACY", "healthcare"),

    # Investments
    ("ACH-ZERODHA-BROKING-SIP", "investments"),
    ("GROWW-MUTUAL-FUND-INVESTMENT", "investments"),
    ("INDMONEY-US-STOCKS", "investments"),
    ("SMALLCASE-PORTFOLIO-SIP", "investments"),

    # Income
    ("ACH-ACME-CORP-SALARY-CREDIT", "income"),
    ("PAYROLL-MONTHLY-SALARY", "income"),
    ("INTEREST-CREDIT-SAVINGS-BANK", "income"),
]

def train_and_save_model():
    """Trains TF-IDF + Logistic Regression and serializes pipeline."""
    X_train = [text for text, label in TRAINING_DATA]
    y_train = [label for text, label in TRAINING_DATA]

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 3), lowercase=True, max_features=1000)),
        ('clf', LogisticRegression(C=10.0, max_iter=200, solver='lbfgs'))
    ])

    pipeline.fit(X_train, y_train)
    joblib.dump(pipeline, MODEL_FILE)
    print(f"✅ ML Model successfully trained on {len(X_train)} samples and saved to '{MODEL_FILE}'")
    return pipeline

def load_or_train_model():
    """Loads existing pipeline model or trains fresh if missing."""
    if os.path.exists(MODEL_FILE):
        try:
            return joblib.load(MODEL_FILE)
        except Exception:
            pass
    return train_and_save_model()

if __name__ == "__main__":
    train_and_save_model()