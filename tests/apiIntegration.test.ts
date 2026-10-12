import { runLoanAssessment } from '../src/server/mlEngine';
import { getApplications, getApplicationById, saveApplicationRecord } from '../src/server/db';
import { LoanApplicationInput } from '../src/types';

async function runIntegrationTests() {
  console.log('--- Running API & Pipeline Integration Tests ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, msg: string) {
    total++;
    if (!condition) {
      console.error(`❌ INTEGRATION TEST FAILED: ${msg}`);
      process.exit(1);
    } else {
      passed++;
      console.log(`✅ PASSED: ${msg}`);
    }
  }

  // Test 1: Full Home Loan Assessment Execution
  const homeLoanInput: LoanApplicationInput = {
    loan_type: 'home',
    loan_purpose: 'Suburban Property Purchase',
    loan_amount: 175,
    loan_amount_term: 240,
    interest_rate: 8.5,
    collateral_value: 230,
    down_payment: 55,
    married: 'Yes',
    dependents: '1',
    education: 'Graduate',
    self_employed: 'No',
    employment_category: 'salaried',
    employment_duration_months: 40,
    applicant_income: 7000,
    net_monthly_income: 5800,
    additional_monthly_income: 0,
    coapplicant_income: 2500,
    existing_monthly_emi: 500,
    other_monthly_debt: 200,
    credit_card_outstanding: 400,
    credit_card_limit: 4000,
    essential_living_expenses: 1600,
    has_credit_history: true,
    credit_history: '1',
    credit_score: 750,
    property_area: 'Semiurban',
    income_verification_status: 'verified',
    consent_given: true,
    declaration_accepted: true,
  };

  const homeResult = runLoanAssessment(homeLoanInput);
  assert(homeResult.application_id.startsWith('LIQ-'), `Generated application ID: ${homeResult.application_id}`);
  assert(
    homeResult.assessment_outcome === 'Eligible for further consideration',
    `Home loan approved as Eligible for further consideration, got: ${homeResult.assessment_outcome}`
  );
  assert(homeResult.financial_metrics.proposed_emi > 0, `Computed proposed EMI > 0: ${homeResult.financial_metrics.proposed_emi}`);
  assert(homeResult.financial_metrics.foir_pct < 45, `FOIR is below 45%: ${homeResult.financial_metrics.foir_pct}%`);
  assert(homeResult.financial_metrics.ltv_pct !== null && homeResult.financial_metrics.ltv_pct < 80, `LTV within limits: ${homeResult.financial_metrics.ltv_pct}%`);

  // Test 2: High-DTI / High-Risk Personal Loan
  const highRiskInput: LoanApplicationInput = {
    loan_type: 'personal',
    loan_purpose: 'Credit Card Payoff',
    loan_amount: 120,
    loan_amount_term: 24,
    interest_rate: 14.0,
    married: 'No',
    dependents: '2',
    education: 'Not Graduate',
    self_employed: 'Yes',
    employment_category: 'self_employed',
    employment_duration_months: 12,
    applicant_income: 3000,
    net_monthly_income: 2400,
    additional_monthly_income: 0,
    coapplicant_income: 0,
    existing_monthly_emi: 1200,
    other_monthly_debt: 400,
    credit_card_outstanding: 3800,
    credit_card_limit: 4000,
    essential_living_expenses: 1200,
    has_credit_history: true,
    credit_history: '0',
    property_area: 'Rural',
    income_verification_status: 'self_declared',
    consent_given: true,
    declaration_accepted: true,
  };

  const highRiskResult = runLoanAssessment(highRiskInput);
  assert(
    highRiskResult.assessment_outcome === 'Higher estimated repayment risk' ||
    highRiskResult.assessment_outcome === 'Not eligible under the configured policy',
    `High-risk applicant assigned risk outcome, got: ${highRiskResult.assessment_outcome}`
  );
  assert(highRiskResult.credit_risk_tier === 'Elevated' || highRiskResult.credit_risk_tier === 'High', `Risk tier assigned: ${highRiskResult.credit_risk_tier}`);

  // Test 3: Unverified / No Credit History
  const noHistoryInput: LoanApplicationInput = {
    ...homeLoanInput,
    has_credit_history: false,
    credit_history: 'unknown',
    income_verification_status: 'pending',
  };
  const noHistoryResult = runLoanAssessment(noHistoryInput);
  assert(
    noHistoryResult.assessment_outcome === 'Additional information required',
    `No credit history & pending verification triggers 'Additional information required', got: ${noHistoryResult.assessment_outcome}`
  );
  assert(
    noHistoryResult.missing_or_unverified_items.length > 0,
    `Identified outstanding items: ${noHistoryResult.missing_or_unverified_items.join(', ')}`
  );

  // Test 4: Database Persistence & Retrieval
  saveApplicationRecord(homeResult);
  const found = getApplicationById(homeResult.application_id);
  assert(found !== null, `Stored application found by ID: ${homeResult.application_id}`);
  assert(found?.application_id === homeResult.application_id, 'Stored ID matches');

  const allApps = getApplications();
  assert(allApps.length >= 3, `Application database contains >= 3 records (found ${allApps.length})`);

  console.log(`\n🎉 All ${passed}/${total} integration tests passed successfully!`);
}

runIntegrationTests();
