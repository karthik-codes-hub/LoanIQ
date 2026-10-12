import { FinancialMetrics, LoanApplicationInput } from '../types';

/**
 * Standard Amortizing-Loan Formula:
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 *
 * Where:
 * - P = principal amount
 * - r = monthly interest rate (annual rate / 12 / 100)
 * - n = number of monthly instalments
 */
export function calculateProposedEMI(
  principal: number,
  annualInterestRatePct: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;

  // Handle zero-interest financing
  if (annualInterestRatePct <= 0) {
    return Number((principal / tenureMonths).toFixed(2));
  }

  const monthlyRate = annualInterestRatePct / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRate, tenureMonths);

  if (!isFinite(growthFactor) || growthFactor === 1) {
    return Number((principal / tenureMonths).toFixed(2));
  }

  const emi = (principal * monthlyRate * growthFactor) / (growthFactor - 1);
  return Number(emi.toFixed(2));
}

/**
 * Total Gross Monthly Income
 */
export function calculateTotalGrossMonthlyIncome(
  applicantGross: number,
  coapplicantGross: number = 0,
  additionalIncome: number = 0
): number {
  const a = Math.max(0, Number(applicantGross) || 0);
  const c = Math.max(0, Number(coapplicantGross) || 0);
  const ad = Math.max(0, Number(additionalIncome) || 0);
  return Number((a + c + ad).toFixed(2));
}

/**
 * Total Net Monthly Take-Home Income
 */
export function calculateTotalNetMonthlyIncome(
  applicantNet: number,
  coapplicantGross: number = 0,
  additionalIncome: number = 0
): number {
  const net = Math.max(0, Number(applicantNet) || 0);
  // Estimate 85% take-home on co-applicant & additional if not broken down
  const coapplicantNet = Math.max(0, (Number(coapplicantGross) || 0) * 0.85);
  const additionalNet = Math.max(0, (Number(additionalIncome) || 0) * 0.9);
  return Number((net + coapplicantNet + additionalNet).toFixed(2));
}

/**
 * Debt-to-Income Ratio (DTI):
 * Total monthly debt payments divided by gross monthly income, multiplied by 100.
 */
export function calculateDTI(
  existingMonthlyDebt: number,
  grossMonthlyIncome: number
): number {
  if (grossMonthlyIncome <= 0) return 100;
  const ratio = (Math.max(0, existingMonthlyDebt) / grossMonthlyIncome) * 100;
  return Number(ratio.toFixed(2));
}

/**
 * Fixed-Obligation-to-Income Ratio (FOIR):
 * Total fixed monthly obligations, INCLUDING proposed EMI, divided by net monthly income, multiplied by 100.
 */
export function calculateFOIR(
  totalFixedObligationsWithProposedEMI: number,
  netMonthlyIncome: number
): number {
  if (netMonthlyIncome <= 0) return 100;
  const ratio = (Math.max(0, totalFixedObligationsWithProposedEMI) / netMonthlyIncome) * 100;
  return Number(ratio.toFixed(2));
}

/**
 * Monthly Disposable Income:
 * Net monthly income minus existing debt obligations, proposed EMI, and estimated essential living expenses.
 */
export function calculateDisposableIncome(
  netMonthlyIncome: number,
  existingMonthlyDebt: number,
  proposedEMI: number,
  essentialLivingExpenses: number
): number {
  const totalOutflows =
    Math.max(0, existingMonthlyDebt) +
    Math.max(0, proposedEMI) +
    Math.max(0, essentialLivingExpenses);
  return Number((netMonthlyIncome - totalOutflows).toFixed(2));
}

/**
 * Loan-to-Income Ratio (LTI):
 * Requested loan amount divided by annual gross income.
 */
export function calculateLTI(
  requestedLoanAmount: number,
  annualGrossIncome: number
): number {
  if (annualGrossIncome <= 0) return 99;
  return Number((requestedLoanAmount / annualGrossIncome).toFixed(2));
}

/**
 * Credit Utilization Ratio:
 * Revolving credit balance divided by total available revolving credit limit, multiplied by 100.
 */
export function calculateCreditUtilization(
  revolvingBalance: number,
  revolvingLimit: number
): number | null {
  if (revolvingLimit <= 0 || isNaN(revolvingLimit)) return null;
  const ratio = (Math.max(0, revolvingBalance) / revolvingLimit) * 100;
  return Number(ratio.toFixed(2));
}

/**
 * Loan-to-Value Ratio (LTV):
 * For secured lending, requested loan amount divided by verified collateral value, multiplied by 100.
 */
export function calculateLTV(
  requestedLoanAmount: number,
  collateralValue?: number
): number | null {
  if (!collateralValue || collateralValue <= 0 || isNaN(collateralValue)) return null;
  const ratio = (requestedLoanAmount / collateralValue) * 100;
  return Number(ratio.toFixed(2));
}

/**
 * Master computation returning all derived financial metrics for an application
 */
export function computeAllFinancialMetrics(input: LoanApplicationInput): FinancialMetrics {
  const grossMonthlyIncome = calculateTotalGrossMonthlyIncome(
    input.applicant_income,
    input.coapplicant_income,
    input.additional_monthly_income
  );

  const netMonthlyIncome = calculateTotalNetMonthlyIncome(
    input.net_monthly_income || input.applicant_income * 0.82,
    input.coapplicant_income,
    input.additional_monthly_income
  );

  const principalActual = (Number(input.loan_amount) || 100) * 1000;
  const annualInterestRate = Number(input.interest_rate) > 0 ? Number(input.interest_rate) : 9.5;
  const tenureMonths = Math.max(12, Number(input.loan_amount_term) || 360);

  const proposedEMI = calculateProposedEMI(principalActual, annualInterestRate, tenureMonths);

  const existingMonthlyDebt =
    Math.max(0, Number(input.existing_monthly_emi) || 0) +
    Math.max(0, Number(input.other_monthly_debt) || 0);

  const dti = calculateDTI(existingMonthlyDebt, grossMonthlyIncome);

  const totalFixedObligations = existingMonthlyDebt + proposedEMI;
  const foir = calculateFOIR(totalFixedObligations, netMonthlyIncome);

  const livingExpenses = Math.max(0, Number(input.essential_living_expenses) || 0);
  const disposableIncome = calculateDisposableIncome(
    netMonthlyIncome,
    existingMonthlyDebt,
    proposedEMI,
    livingExpenses
  );

  const annualGrossIncome = grossMonthlyIncome * 12;
  const lti = calculateLTI(principalActual, annualGrossIncome);

  const creditUtilization = calculateCreditUtilization(
    Number(input.credit_card_outstanding) || 0,
    Number(input.credit_card_limit) || 0
  );

  let ltv: number | null = null;
  if (input.loan_type === 'home' || input.loan_type === 'vehicle') {
    const collateralActual = (Number(input.collateral_value) || 0) * 1000;
    ltv = calculateLTV(principalActual, collateralActual);
  }

  return {
    total_gross_monthly_income: grossMonthlyIncome,
    total_net_monthly_income: netMonthlyIncome,
    proposed_emi: proposedEMI,
    annual_interest_rate_pct: annualInterestRate,
    dti_pct: dti,
    foir_pct: foir,
    disposable_income: disposableIncome,
    lti_ratio: lti,
    credit_utilization_pct: creditUtilization,
    ltv_pct: ltv,
  };
}
