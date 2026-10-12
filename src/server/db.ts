import fs from 'fs';
import path from 'path';
import { StoredApplication, AssessmentResult } from '../types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'applications.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INITIAL_SEEDS: StoredApplication[] = [
  {
    application_id: 'LIQ-8E4A91',
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    loan_type: 'home',
    assessment_outcome: 'Eligible for further consideration',
    credit_risk_tier: 'Low',
    calibrated_probability: 0.892,
    model_name: 'LoanIQ Hybrid ML & Affordability Engine (v2.0)',
    model_version: '2.0.0',
    loan_product_support_status: 'fully_supported_ml',
    financial_metrics: {
      total_gross_monthly_income: 8600,
      total_net_monthly_income: 7350,
      proposed_emi: 1344.25,
      annual_interest_rate_pct: 8.5,
      dti_pct: 12.2,
      foir_pct: 29.8,
      disposable_income: 3805.75,
      lti_ratio: 1.55,
      credit_utilization_pct: 18.5,
      ltv_pct: 72.7,
    },
    decision_rationale:
      'Strong financial profile: healthy FOIR (29.8%), positive disposable cash buffer (₹3,805/mo), sound LTV (72.7%), and clean repayment history.',
    applicant_factors: [
      {
        factor: 'Credit History Record',
        impact: 'positive',
        description: 'Documented satisfactory repayment history on past facilities indicates low default propensity.',
        importance: 41.8,
      },
      {
        factor: 'Fixed-Obligation-to-Income (FOIR)',
        impact: 'positive',
        description: 'Healthy FOIR of 29.8%. Proposed EMI + debts absorb well below institutional ceilings.',
        importance: 28.5,
      },
      {
        factor: 'Loan-to-Value (LTV)',
        impact: 'positive',
        description: 'Sound collateral coverage with an LTV of 72.7%, meeting institutional collateral security benchmarks.',
        importance: 15.0,
      },
    ],
    missing_or_unverified_items: [],
    next_steps: [
      'Proceed to formal document verification and KYC check.',
      'Review sanction letter terms and interest-rate options with lending officer.',
    ],
    input_data: {
      loan_type: 'home',
      loan_purpose: 'Residential Property Purchase',
      loan_amount: 160,
      loan_amount_term: 240,
      interest_rate: 8.5,
      collateral_value: 220,
      down_payment: 60,
      married: 'Yes',
      dependents: '1',
      education: 'Graduate',
      self_employed: 'No',
      employment_category: 'salaried',
      employment_duration_months: 48,
      applicant_income: 6200,
      net_monthly_income: 5300,
      additional_monthly_income: 0,
      coapplicant_income: 2400,
      existing_monthly_emi: 600,
      other_monthly_debt: 250,
      credit_card_outstanding: 500,
      credit_card_limit: 4000,
      essential_living_expenses: 1350,
      has_credit_history: true,
      credit_history: '1',
      property_area: 'Semiurban',
      income_verification_status: 'verified',
      consent_given: true,
      declaration_accepted: true,
    },
  },
  {
    application_id: 'LIQ-4C9F12',
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    loan_type: 'personal',
    assessment_outcome: 'Higher estimated repayment risk',
    credit_risk_tier: 'Elevated',
    calibrated_probability: 0.185,
    model_name: 'LoanIQ Hybrid ML & Affordability Engine (v2.0)',
    model_version: '2.0.0',
    loan_product_support_status: 'fully_supported_ml',
    financial_metrics: {
      total_gross_monthly_income: 3800,
      total_net_monthly_income: 3100,
      proposed_emi: 1120.4,
      annual_interest_rate_pct: 12.0,
      dti_pct: 28.9,
      foir_pct: 65.2,
      disposable_income: 279.6,
      lti_ratio: 1.75,
      credit_utilization_pct: 82.5,
      ltv_pct: null,
    },
    decision_rationale:
      'Documented history of repayment delays elevates credit risk. High credit utilization (82.5%) and tight disposable income buffer.',
    applicant_factors: [
      {
        factor: 'Credit History Record',
        impact: 'negative',
        description: 'Documented past late payments or missed obligations.',
        importance: 41.8,
      },
      {
        factor: 'Fixed-Obligation-to-Income (FOIR)',
        impact: 'negative',
        description: 'Elevated FOIR of 65.2% exceeds prudent lending bounds.',
        importance: 28.5,
      },
    ],
    missing_or_unverified_items: ['Settlement proof of past delinquent obligations pending.'],
    next_steps: [
      'Provide documentary evidence of resolved or settled prior obligations.',
      'Reduce requested loan amount to lower monthly debt ratio.',
    ],
    input_data: {
      loan_type: 'personal',
      loan_purpose: 'Debt Consolidation',
      loan_amount: 80,
      loan_amount_term: 60,
      interest_rate: 12.0,
      married: 'No',
      dependents: '0',
      education: 'Graduate',
      self_employed: 'Yes',
      employment_category: 'self_employed',
      employment_duration_months: 24,
      applicant_income: 3800,
      net_monthly_income: 3100,
      additional_monthly_income: 0,
      coapplicant_income: 0,
      existing_monthly_emi: 900,
      other_monthly_debt: 200,
      credit_card_outstanding: 3300,
      credit_card_limit: 4000,
      essential_living_expenses: 1600,
      has_credit_history: true,
      credit_history: '0',
      property_area: 'Urban',
      income_verification_status: 'self_declared',
      consent_given: true,
      declaration_accepted: true,
    },
  },
  {
    application_id: 'LIQ-7B2D05',
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    loan_type: 'business',
    assessment_outcome: 'Refer for human review',
    credit_risk_tier: 'Moderate',
    calibrated_probability: 0.654,
    model_name: 'LoanIQ Hybrid ML & Affordability Engine (v2.0)',
    model_version: '2.0.0',
    loan_product_support_status: 'prototype_affordability_only',
    financial_metrics: {
      total_gross_monthly_income: 14500,
      total_net_monthly_income: 11200,
      proposed_emi: 2650.0,
      annual_interest_rate_pct: 10.5,
      dti_pct: 18.0,
      foir_pct: 42.4,
      disposable_income: 3850.0,
      lti_ratio: 1.44,
      credit_utilization_pct: 25.0,
      ltv_pct: null,
    },
    decision_rationale:
      'Application meets preliminary quantitative criteria, but business operating variability requires manual underwriter review. Note: For business loans, assessment is evaluated using financial affordability rules; specialized institutional commercial ML models require authorized portfolio data.',
    applicant_factors: [
      {
        factor: 'Business Cash Flow Coverage',
        impact: 'positive',
        description: 'Demonstrated business gross turnover supports monthly amortization commitments.',
        importance: 30.0,
      },
      {
        factor: 'Operating Duration',
        impact: 'neutral',
        description: 'Business operating history of 36 months requires financial statement verification.',
        importance: 20.0,
      },
    ],
    missing_or_unverified_items: [
      'Audited financial statements and last 2 years tax returns required.',
      'Bank statement verification for business current account.',
    ],
    next_steps: [
      'Application routed to senior commercial credit analyst for manual risk appraisal.',
      'Upload audited balance sheets and GST reconciliation certificates.',
    ],
    input_data: {
      loan_type: 'business',
      loan_purpose: 'Working Capital & Inventory',
      loan_amount: 250,
      loan_amount_term: 120,
      interest_rate: 10.5,
      married: 'Yes',
      dependents: '2',
      education: 'Graduate',
      self_employed: 'Yes',
      employment_category: 'business_owner',
      employment_duration_months: 36,
      applicant_income: 12000,
      net_monthly_income: 9500,
      additional_monthly_income: 2500,
      coapplicant_income: 0,
      business_turnover: 180000,
      business_operating_costs: 95000,
      business_net_profit: 35000,
      existing_monthly_emi: 1500,
      other_monthly_debt: 600,
      credit_card_outstanding: 2500,
      credit_card_limit: 10000,
      essential_living_expenses: 2600,
      has_credit_history: true,
      credit_history: '1',
      property_area: 'Urban',
      income_verification_status: 'pending',
      consent_given: true,
      declaration_accepted: true,
    },
  },
];

export function getApplications(): StoredApplication[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEEDS, null, 2), 'utf8');
      return INITIAL_SEEDS;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    const list = Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEEDS;

    return list.map((a: any): StoredApplication => {
      const loanAmount = Number(a.input_data?.loan_amount ?? a.loan_amount ?? 150);
      const loanTerm = Number(a.input_data?.loan_amount_term ?? a.loan_amount_term ?? 240);
      const applicantIncome = Number(a.input_data?.applicant_income ?? a.applicant_income ?? 6000);
      const coapplicantIncome = Number(a.input_data?.coapplicant_income ?? a.coapplicant_income ?? 0);
      const netIncome = Number(a.input_data?.net_monthly_income ?? applicantIncome * 0.82);
      const existingDebt = Number(a.input_data?.existing_monthly_emi ?? 500);
      const interestRate = Number(a.input_data?.interest_rate ?? 8.5);
      const grossTotal = applicantIncome + coapplicantIncome;
      const proposedEMI = Number(
        (a.financial_metrics?.proposed_emi ??
          Math.round((loanAmount * 1000 * (interestRate / 1200)) / (1 - Math.pow(1 + interestRate / 1200, -loanTerm)))) ||
          1200
      );

      const foir = Number(a.financial_metrics?.foir_pct ?? (((existingDebt + proposedEMI) / (netIncome || 1)) * 100).toFixed(1));
      const dti = Number(a.financial_metrics?.dti_pct ?? ((existingDebt / (grossTotal || 1)) * 100).toFixed(1));
      const disposable = Number(a.financial_metrics?.disposable_income ?? (netIncome - existingDebt - proposedEMI - 1500));
      const outcome = a.assessment_outcome ?? (a.prediction === 'Likely Approved' ? 'Eligible for further consideration' : 'Higher estimated repayment risk');
      const riskTier = a.credit_risk_tier ?? (outcome === 'Eligible for further consideration' ? 'Low' : 'Elevated');

      return {
        application_id: a.application_id || `LIQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        submitted_at: a.submitted_at || new Date().toISOString(),
        loan_type: a.loan_type || 'home',
        assessment_outcome: outcome,
        credit_risk_tier: riskTier,
        calibrated_probability: Number(a.calibrated_probability ?? a.probability ?? 0.85),
        model_name: a.model_name || 'LoanIQ Hybrid ML & Affordability Engine (v2.0)',
        model_version: a.model_version || '2.0.0',
        loan_product_support_status: a.loan_product_support_status || 'fully_supported_ml',
        financial_metrics: a.financial_metrics || {
          total_gross_monthly_income: grossTotal,
          total_net_monthly_income: netIncome,
          proposed_emi: proposedEMI,
          annual_interest_rate_pct: interestRate,
          dti_pct: dti,
          foir_pct: foir,
          disposable_income: disposable,
          lti_ratio: Number((loanAmount * 1000 / ((grossTotal || 1) * 12)).toFixed(2)),
          credit_utilization_pct: 25,
          ltv_pct: a.loan_type === 'home' ? 75 : null,
        },
        decision_rationale: a.decision_rationale || 'Evaluated against benchmark affordability and credit risk features.',
        applicant_factors: a.applicant_factors || [
          { factor: 'Credit History Record', impact: 'positive', description: 'Satisfactory repayment record on past facilities.', importance: 41.8 },
          { factor: 'Fixed-Obligation-to-Income (FOIR)', impact: 'positive', description: 'Healthy debt ratio supporting monthly commitments.', importance: 28.5 },
        ],
        missing_or_unverified_items: a.missing_or_unverified_items || [],
        next_steps: a.next_steps || ['Proceed to formal verification and KYC check.'],
        input_data: a.input_data || {
          loan_type: a.loan_type || 'home',
          loan_purpose: 'Residential Property Purchase',
          loan_amount: loanAmount,
          loan_amount_term: loanTerm,
          interest_rate: interestRate,
          married: a.married || 'Yes',
          dependents: a.dependents || '1',
          education: a.education || 'Graduate',
          self_employed: a.self_employed || 'No',
          employment_category: 'salaried',
          employment_duration_months: 36,
          applicant_income: applicantIncome,
          net_monthly_income: netIncome,
          additional_monthly_income: 0,
          coapplicant_income: coapplicantIncome,
          existing_monthly_emi: existingDebt,
          other_monthly_debt: 100,
          credit_card_outstanding: 500,
          credit_card_limit: 4000,
          essential_living_expenses: 1500,
          has_credit_history: true,
          credit_history: a.credit_history || '1',
          property_area: a.property_area || 'Semiurban',
          income_verification_status: 'verified',
          consent_given: true,
          declaration_accepted: true,
        },
      };
    });
  } catch (err) {
    console.error('Error reading application database:', err);
    return INITIAL_SEEDS;
  }
}

export function saveApplicationRecord(app: StoredApplication): void {
  try {
    const list = getApplications();
    // Prepend new application to the front
    list.unshift(app);
    fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving application record:', err);
  }
}

export function getApplicationById(id: string): StoredApplication | null {
  const list = getApplications();
  return list.find((a) => a.application_id.toLowerCase() === id.toLowerCase()) || null;
}

export function deleteApplicationRecord(id: string): boolean {
  try {
    const list = getApplications();
    const filtered = list.filter((a) => a.application_id.toLowerCase() !== id.toLowerCase());
    if (filtered.length !== list.length) {
      fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2), 'utf8');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error deleting application record:', err);
    return false;
  }
}
