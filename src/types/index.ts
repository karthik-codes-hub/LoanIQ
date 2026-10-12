export type LoanType = 'personal' | 'home' | 'vehicle' | 'business';

export type AssessmentOutcome =
  | 'Eligible for further consideration'
  | 'Higher estimated repayment risk'
  | 'Additional information required'
  | 'Refer for human review'
  | 'Not eligible under the configured policy';

export type CreditRiskTier = 'Low' | 'Moderate' | 'Elevated' | 'High';

export interface FinancialMetrics {
  total_gross_monthly_income: number;
  total_net_monthly_income: number;
  proposed_emi: number;
  annual_interest_rate_pct: number;
  dti_pct: number; // Debt-to-Income (Existing debts / Gross income) * 100
  foir_pct: number; // Fixed-Obligation-to-Income ((Existing debts + Proposed EMI) / Net income) * 100
  disposable_income: number; // Net income - Existing debts - Proposed EMI - Living expenses
  lti_ratio: number; // Loan-to-Income (Requested loan / Annual gross income)
  credit_utilization_pct: number | null;
  ltv_pct: number | null; // Loan-to-Value (Requested loan / Collateral value) * 100 for secured loans
}

export interface LoanApplicationInput {
  // Section 1: Loan Information
  loan_type: LoanType;
  loan_purpose: string;
  loan_amount: number; // In thousands (e.g., 150 = ₹150,000 / $150,000)
  loan_amount_term: number; // In months (e.g., 12 to 360)
  interest_rate: number; // Annual % (clearly disclosed default e.g., 9.5%)
  collateral_type?: string;
  collateral_value?: number; // In thousands
  down_payment?: number; // In thousands

  // Section 2: Applicant & Employment Information
  married: 'Yes' | 'No';
  dependents: '0' | '1' | '2' | '3+';
  education: 'Graduate' | 'Not Graduate';
  self_employed: 'Yes' | 'No';
  employment_category: 'salaried' | 'self_employed' | 'business_owner';
  employment_duration_months: number;
  applicant_income: number; // Gross monthly
  net_monthly_income: number; // Net take-home monthly
  additional_monthly_income: number;
  coapplicant_income: number; // Co-applicant gross monthly
  business_turnover?: number;
  business_operating_costs?: number;
  business_net_profit?: number;

  // Section 3: Existing Financial Obligations
  existing_monthly_emi: number;
  other_monthly_debt: number;
  credit_card_outstanding: number;
  credit_card_limit: number;
  essential_living_expenses: number;

  // Section 4: Credit History
  has_credit_history: boolean;
  credit_history: '1' | '0' | 'unknown'; // Kaggle benchmark compatibility: '1'=Good, '0'=Arrears/Default, 'unknown'=None
  credit_score?: number | null;
  late_payments_defaults?: boolean;
  recent_credit_enquiries?: number;
  credit_history_length_months?: number;

  // Section 5: Property / Collateral (Home, Vehicle, Secured)
  property_area: 'Urban' | 'Semiurban' | 'Rural';

  // Section 6: Verification & Consent
  income_verification_status: 'verified' | 'pending' | 'self_declared';
  consent_given: boolean;
  declaration_accepted: boolean;
}

export interface ExplanatoryFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  importance?: number;
}

export interface AssessmentResult {
  application_id: string;
  submitted_at: string;
  loan_type: LoanType;
  assessment_outcome: AssessmentOutcome;
  credit_risk_tier: CreditRiskTier;
  calibrated_probability: number; // 0.0 to 1.0 (estimated likelihood of meeting debt obligations)
  model_name: string;
  model_version: string;
  loan_product_support_status: 'fully_supported_ml' | 'prototype_affordability_only';

  // Financial calculations
  financial_metrics: FinancialMetrics;

  // Decision details
  decision_rationale: string;
  applicant_factors: ExplanatoryFactor[];
  missing_or_unverified_items: string[];
  next_steps: string[];

  // Echoed input for reports
  input_data: LoanApplicationInput;
}

export interface StoredApplication extends AssessmentResult {}

export interface ModelEvaluation {
  model_name: string;
  trained_at: string;
  model_version: string;
  dataset: {
    train_file: string;
    total_rows: number;
    dev_rows: number;
    test_rows: number;
    features: string[];
    target: string;
  };
  cv_metrics: {
    f1_mean: number;
    f1_std: number;
  };
  test_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
    confusion_matrix: number[][];
    classification_report: Record<string, any>;
  };
  model_comparison: {
    DecisionTree: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
    };
    RandomForest: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
    };
  };
  feature_importance: Record<string, number>;
  positive_class: string;
  selection_criterion: string;
}
