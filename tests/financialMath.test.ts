import {
  calculateProposedEMI,
  calculateTotalGrossMonthlyIncome,
  calculateTotalNetMonthlyIncome,
  calculateDTI,
  calculateFOIR,
  calculateDisposableIncome,
  calculateLTI,
  calculateCreditUtilization,
  calculateLTV,
  computeAllFinancialMetrics,
} from '../src/server/financialMath';
import { LoanApplicationInput } from '../src/types';

function runTests() {
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, msg: string) {
    total++;
    if (!condition) {
      console.error(`❌ FAILED: ${msg}`);
      process.exit(1);
    } else {
      passed++;
      console.log(`✅ PASSED: ${msg}`);
    }
  }

  console.log('--- Testing Financial Calculations ---');

  // Test 1: EMI Calculation
  // Principal: 100,000, 10% annual, 12 months -> EMI is approx 8791.59
  const emiStandard = calculateProposedEMI(100000, 10, 12);
  assert(Math.abs(emiStandard - 8791.59) < 0.1, `Standard EMI is ~8791.59, got ${emiStandard}`);

  // Test 2: EMI Zero Interest
  const emiZero = calculateProposedEMI(120000, 0, 12);
  assert(emiZero === 10000, `Zero-interest EMI is 10000, got ${emiZero}`);

  // Test 3: Total Gross Monthly Income
  const gross = calculateTotalGrossMonthlyIncome(5000, 2000, 500);
  assert(gross === 7500, `Gross income combines 5000+2000+500 = 7500, got ${gross}`);

  // Test 4: Debt-to-Income (DTI)
  // Debt: 1500, Gross: 5000 -> 30%
  const dti = calculateDTI(1500, 5000);
  assert(dti === 30, `DTI is 30%, got ${dti}`);

  // Test 5: Fixed-Obligation-to-Income Ratio (FOIR)
  // Total Obligations (Debt 1500 + Proposed EMI 1000 = 2500), Net: 5000 -> 50%
  const foir = calculateFOIR(2500, 5000);
  assert(foir === 50, `FOIR is 50%, got ${foir}`);

  // Test 6: Disposable Income
  // Net: 5000, Debt: 1000, EMI: 800, Living expenses: 1500 -> 1700
  const disp = calculateDisposableIncome(5000, 1000, 800, 1500);
  assert(disp === 1700, `Disposable income is 1700, got ${disp}`);

  // Test 7: Loan-to-Income (LTI)
  // Loan: 600,000, Annual Gross: 120,000 -> 5.0
  const lti = calculateLTI(600000, 120000);
  assert(lti === 5.0, `LTI ratio is 5.0, got ${lti}`);

  // Test 8: Credit Utilization
  const cu = calculateCreditUtilization(3000, 10000);
  assert(cu === 30, `Credit utilization is 30%, got ${cu}`);

  const cuMissing = calculateCreditUtilization(3000, 0);
  assert(cuMissing === null, `Credit utilization for missing/zero limit is null, got ${cuMissing}`);

  // Test 9: Loan-to-Value (LTV)
  const ltv = calculateLTV(800000, 1000000);
  assert(ltv === 80, `LTV is 80%, got ${ltv}`);

  const ltvMissing = calculateLTV(800000, 0);
  assert(ltvMissing === null, `LTV with zero collateral is null, got ${ltvMissing}`);

  // Test 10: Master computeAllFinancialMetrics
  const mockInput: LoanApplicationInput = {
    loan_type: 'home',
    loan_purpose: 'Purchase',
    loan_amount: 200, // 200,000
    loan_amount_term: 240, // 20 years
    interest_rate: 8.5,
    collateral_value: 260, // 260,000
    down_payment: 60,
    married: 'Yes',
    dependents: '1',
    education: 'Graduate',
    self_employed: 'No',
    employment_category: 'salaried',
    employment_duration_months: 36,
    applicant_income: 8000,
    net_monthly_income: 6800,
    additional_monthly_income: 500,
    coapplicant_income: 2500,
    existing_monthly_emi: 800,
    other_monthly_debt: 200,
    credit_card_outstanding: 500,
    credit_card_limit: 5000,
    essential_living_expenses: 2200,
    has_credit_history: true,
    credit_history: '1',
    property_area: 'Semiurban',
    income_verification_status: 'verified',
    consent_given: true,
    declaration_accepted: true,
  };

  const metrics = computeAllFinancialMetrics(mockInput);
  assert(metrics.proposed_emi > 0, `Proposed EMI calculated: ${metrics.proposed_emi}`);
  assert(metrics.foir_pct > 0 && metrics.foir_pct < 100, `FOIR computed: ${metrics.foir_pct}%`);
  assert(metrics.disposable_income > 0, `Positive disposable income: ${metrics.disposable_income}`);
  assert(metrics.ltv_pct !== null && metrics.ltv_pct < 100, `LTV computed: ${metrics.ltv_pct}%`);

  console.log(`\n🎉 All ${passed}/${total} financial calculation tests passed!`);
}

runTests();
