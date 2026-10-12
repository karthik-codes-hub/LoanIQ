import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'loaniq-dev-secret-key-change-in-production')
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600

    # Data paths
    DATA_DIR = BASE_DIR / 'data'
    TRAIN_CSV = DATA_DIR / 'train_u6lujuX_CVtuZ9i.csv'
    TEST_CSV  = DATA_DIR / 'test_Y3wMUE5_7gLdaTN.csv'

    # Model paths
    MODELS_DIR = BASE_DIR / 'models'
    MODEL_PATH = MODELS_DIR / 'loan_pipeline.joblib'
    EVALUATION_PATH = MODELS_DIR / 'evaluation.json'

    # Database
    DATABASE_DIR = BASE_DIR / 'database'
    DATABASE_PATH = DATABASE_DIR / 'loaniq.db'

    # Export
    EXPORT_DIR = BASE_DIR / 'exports'

    # App
    APP_NAME = 'LoanIQ'
    APP_SUBTITLE = 'AI-Powered Loan Approval Prediction System'

    # Features used by the model (Gender and Loan_ID excluded)
    MODEL_FEATURES = [
        'Married', 'Dependents', 'Education', 'Self_Employed',
        'ApplicantIncome', 'CoapplicantIncome', 'LoanAmount',
        'Loan_Amount_Term', 'Credit_History', 'Property_Area'
    ]

    CATEGORICAL_FEATURES = ['Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
    NUMERICAL_FEATURES   = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History']

    RANDOM_SEED = 42

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production':  ProductionConfig,
    'default':     DevelopmentConfig,
}
