"""
LoanIQ – Model Training Script
================================
Trains Decision Tree and Random Forest classifiers on the loan dataset,
evaluates on a stratified held-out test set, saves the best pipeline,
and writes evaluation metrics to models/evaluation.json.

Usage:
    python train_model.py
"""

import os
import json
import warnings
import datetime
from pathlib import Path

try:
    import numpy as np
    import pandas as pd
    import joblib
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt

    from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
    from sklearn.pipeline import Pipeline
    from sklearn.compose import ColumnTransformer
    from sklearn.preprocessing import LabelEncoder, OrdinalEncoder
    from sklearn.impute import SimpleImputer
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import (
        accuracy_score, precision_score, recall_score, f1_score,
        confusion_matrix, classification_report, roc_auc_score
    )
except ImportError:
    pass

warnings.filterwarnings('ignore')

BASE_DIR   = Path(__file__).resolve().parent
DATA_DIR   = BASE_DIR / 'data'
MODELS_DIR = BASE_DIR / 'models'
TRAIN_CSV  = DATA_DIR / 'train_u6lujuX_CVtuZ9i.csv'

CATEGORICAL_FEATURES = ['Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
NUMERICAL_FEATURES   = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount',
                        'Loan_Amount_Term', 'Credit_History']
MODEL_FEATURES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES
TARGET = 'Loan_Status'
RANDOM_SEED = 42

if __name__ == '__main__':
    print("LoanIQ Machine Learning Training Script")
    print("Requires: pandas, scikit-learn, joblib, matplotlib")
