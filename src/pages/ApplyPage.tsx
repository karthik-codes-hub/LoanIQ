import React, { useState } from 'react';
import { LoanApplicationInput, AssessmentResult, LoanType } from '../types';
import { runLoanAssessment } from '../server/mlEngine.ts';
import {
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Check,
  AlertCircle,
  Info,
  Building,
  Home,
  Car,
  Briefcase,
  User,
  Calculator,
} from 'lucide-react';

interface ApplyPageProps {
  onSuccess: (result: AssessmentResult) => void;
  onNavigate: (page: string) => void;
  initialParams?: {
    loanType?: LoanType;
    initialAmount?: number;
    initialTenure?: number;
    initialRate?: number;
  };
}

const DEFAULT_INTEREST_RATES: Record<LoanType, number> = {
  personal: 11.5,
  home: 8.5,
  vehicle: 9.0,
  business: 10.5,
};

const INITIAL_FORM: LoanApplicationInput = {
  loan_type: 'home',
  loan_purpose: 'Residential Apartment Purchase',
  loan_amount: 150, // in thousands (₹150,000)
  loan_amount_term: 240, // 20 years
  interest_rate: 8.5,
  collateral_type: 'Freehold Residential Property',
  collateral_value: 200,
  down_payment: 50,

  married: 'Yes',
  dependents: '1',
  education: 'Graduate',
  self_employed: 'No',
  employment_category: 'salaried',
  employment_duration_months: 36,
  applicant_income: 6500,
  net_monthly_income: 5400,
  additional_monthly_income: 0,
  coapplicant_income: 2200,
  business_turnover: 0,
  business_operating_costs: 0,
  business_net_profit: 0,

  existing_monthly_emi: 500,
  other_monthly_debt: 200,
  credit_card_outstanding: 400,
  credit_card_limit: 4000,
  essential_living_expenses: 1400,

  has_credit_history: true,
  credit_history: '1',
  credit_score: 740,
  late_payments_defaults: false,
  recent_credit_enquiries: 1,
  credit_history_length_months: 48,

  property_area: 'Semiurban',

  income_verification_status: 'verified',
  consent_given: true,
  declaration_accepted: true,
};

export const ApplyPage: React.FC<ApplyPageProps> = ({ onSuccess, onNavigate, initialParams }) => {
  const [formData, setFormData] = useState<LoanApplicationInput>(() => {
    const base = { ...INITIAL_FORM };
    if (initialParams?.loanType) {
      base.loan_type = initialParams.loanType;
      base.interest_rate = DEFAULT_INTEREST_RATES[initialParams.loanType] || base.interest_rate;
      if (initialParams.loanType === 'personal') {
        base.loan_purpose = 'Personal Liquidity & Debt Consolidation';
        base.collateral_type = '';
        base.collateral_value = 0;
      } else if (initialParams.loanType === 'vehicle') {
        base.loan_purpose = 'Passenger Automobile Acquisition';
        base.collateral_type = 'Registered Motor Vehicle';
        base.collateral_value = 120;
      } else if (initialParams.loanType === 'business') {
        base.loan_purpose = 'Working Capital & Inventory Procurement';
        base.collateral_type = '';
        base.collateral_value = 0;
      }
    }
    if (initialParams?.initialAmount) {
      base.loan_amount = initialParams.initialAmount;
    }
    if (initialParams?.initialTenure) {
      base.loan_amount_term = initialParams.initialTenure;
    }
    if (initialParams?.initialRate) {
      base.interest_rate = initialParams.initialRate;
    }
    return base;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLoanTypeChange = (type: LoanType) => {
    setFormData((prev) => ({
      ...prev,
      loan_type: type,
      interest_rate: DEFAULT_INTEREST_RATES[type],
      collateral_type:
        type === 'home'
          ? 'Freehold Property'
          : type === 'vehicle'
          ? 'Registered Motor Vehicle'
          : '',
      collateral_value: type === 'home' ? 200 : type === 'vehicle' ? 80 : 0,
    }));
  };

  const handleChange = (field: keyof LoanApplicationInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setApiError(null);
  };

  const handleLoadPreset = (profile: 'prime_home' | 'business_growth' | 'high_dti') => {
    if (profile === 'prime_home') {
      setFormData({
        ...INITIAL_FORM,
        loan_type: 'home',
        loan_purpose: 'Suburban Villa Construction',
        loan_amount: 180,
        loan_amount_term: 240,
        interest_rate: 8.5,
        collateral_value: 240,
        applicant_income: 8000,
        net_monthly_income: 6800,
        coapplicant_income: 3000,
        existing_monthly_emi: 400,
        has_credit_history: true,
        credit_history: '1',
        credit_score: 760,
        property_area: 'Semiurban',
        income_verification_status: 'verified',
      });
    } else if (profile === 'business_growth') {
      setFormData({
        ...INITIAL_FORM,
        loan_type: 'business',
        loan_purpose: 'Commercial Inventory Expansion',
        loan_amount: 220,
        loan_amount_term: 84,
        interest_rate: 10.5,
        employment_category: 'business_owner',
        self_employed: 'Yes',
        applicant_income: 14000,
        net_monthly_income: 11000,
        business_turnover: 180000,
        business_operating_costs: 95000,
        business_net_profit: 35000,
        existing_monthly_emi: 1200,
        has_credit_history: true,
        credit_history: '1',
        income_verification_status: 'pending',
      });
    } else {
      setFormData({
        ...INITIAL_FORM,
        loan_type: 'personal',
        loan_purpose: 'Urgent Unsecured Expense',
        loan_amount: 90,
        loan_amount_term: 36,
        interest_rate: 13.0,
        applicant_income: 3200,
        net_monthly_income: 2600,
        coapplicant_income: 0,
        existing_monthly_emi: 1100,
        other_monthly_debt: 350,
        credit_card_outstanding: 2800,
        credit_card_limit: 3000,
        essential_living_expenses: 1200,
        has_credit_history: true,
        credit_history: '0',
        late_payments_defaults: true,
        income_verification_status: 'self_declared',
      });
    }
    setErrors({});
    setApiError(null);
  };

  // Live quick estimation for the user
  const monthlyRate = (formData.interest_rate || 9.5) / 12 / 100;
  const n = Math.max(1, formData.loan_amount_term || 12);
  const principalActual = (formData.loan_amount || 0) * 1000;
  const growth = Math.pow(1 + monthlyRate, n);
  const estEMI =
    formData.interest_rate > 0
      ? isFinite(growth) && growth > 1
        ? (principalActual * monthlyRate * growth) / (growth - 1)
        : principalActual / n
      : principalActual / n;

  const totalGross =
    (Number(formData.applicant_income) || 0) +
    (Number(formData.coapplicant_income) || 0) +
    (Number(formData.additional_monthly_income) || 0);

  const totalNet =
    Number(formData.net_monthly_income) || (formData.applicant_income || 0) * 0.82;

  const existingDebt =
    (Number(formData.existing_monthly_emi) || 0) + (Number(formData.other_monthly_debt) || 0);

  const liveFOIR = totalNet > 0 ? (((existingDebt + estEMI) / totalNet) * 100).toFixed(1) : '100';
  const liveDisposable = (
    totalNet -
    existingDebt -
    estEMI -
    (Number(formData.essential_living_expenses) || 0)
  ).toFixed(0);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.loan_purpose.trim()) {
      errs.loan_purpose = 'Loan purpose is required.';
    }
    if (!formData.loan_amount || formData.loan_amount <= 0) {
      errs.loan_amount = 'Loan amount must be greater than zero.';
    }
    if (!formData.loan_amount_term || formData.loan_amount_term < 1) {
      errs.loan_amount_term = 'Tenure must be at least 1 month.';
    }
    if (formData.applicant_income === undefined || formData.applicant_income < 0) {
      errs.applicant_income = 'Gross monthly income cannot be negative.';
    }
    if (formData.net_monthly_income === undefined || formData.net_monthly_income < 0) {
      errs.net_monthly_income = 'Net take-home income cannot be negative.';
    }
    if (!formData.consent_given) {
      errs.consent_given = 'Consent is required to evaluate this application.';
    }
    if (!formData.declaration_accepted) {
      errs.declaration_accepted = 'Please confirm the accuracy declaration.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      let result: AssessmentResult;
      try {
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error('Server assessment endpoint error');
        }
        result = await res.json();
      } catch (fetchErr) {
        console.warn('API predict unreachable, using embedded ML engine fallback:', fetchErr);
        result = runLoanAssessment(formData);
      }

      // Sync into local cache for instant Assessment History availability
      try {
        const cached = localStorage.getItem('loaniq_applications');
        const list = cached ? JSON.parse(cached) : [];
        // Prevent duplicate IDs
        const filtered = list.filter((a: any) => a.application_id !== result.application_id);
        filtered.unshift(result);
        localStorage.setItem('loaniq_applications', JSON.stringify(filtered));
      } catch (e) {
        console.error('Storage sync error:', e);
      }

      onSuccess(result);
    } catch (err: any) {
      console.error(err);
      setApiError(err?.message || 'Could not complete loan assessment.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSecured = formData.loan_type === 'home' || formData.loan_type === 'vehicle';
  const isBusiness = formData.loan_type === 'business';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-left">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#315CFD] dark:text-[#19B8A5] mb-2">
          <Calculator className="w-3.5 h-3.5" />
          Affordability & Credit Risk Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#101B35] dark:text-white tracking-tight">
          Loan Application & Assessment
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Provide your financial profile to calculate amortized obligations, debt-to-income ratios, and algorithmic repayment risk.
        </p>

        {/* Presets Toolbar */}
        <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#315CFD]" />
            Load Sample Applicant Presets:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadPreset('prime_home')}
              className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Prime Home Loan
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('business_growth')}
              className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Business Loan
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('high_dti')}
              className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              High-DTI Unsecured
            </button>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Submission Notice: </span>
            {apiError}
          </div>
        </div>
      )}

      {/* Floating Live Financial Summary Strip */}
      <div className="mb-8 p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Proposed Monthly EMI</span>
          <span className="font-bold font-mono-numbers text-sm text-[#315CFD] dark:text-[#19B8A5]">
            ₹{Number(estEMI.toFixed(0)).toLocaleString()}/mo
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">at {formData.interest_rate}% p.a.</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Gross Monthly Income</span>
          <span className="font-bold font-mono-numbers text-sm text-slate-900 dark:text-white">
            ₹{totalGross.toLocaleString()}/mo
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">combined earnings</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Estimated FOIR</span>
          <span className={`font-bold font-mono-numbers text-sm ${Number(liveFOIR) > 55 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
            {liveFOIR}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">ceiling: 50%</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Disposable Surplus</span>
          <span className={`font-bold font-mono-numbers text-sm ${Number(liveDisposable) < 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
            ₹{Number(liveDisposable).toLocaleString()}/mo
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">after all obligations</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        {/* ── SECTION 1: LOAN INFORMATION ─────────────────────────────────── */}
        <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-[#101B35] dark:text-white">
              1. Loan Product & Terms
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select the financing product and specify requested facility parameters.
            </p>
          </div>

          {/* Loan Product Selector Pills/Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Loan Product
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'personal', label: 'Personal Loan', icon: User, note: 'Unsecured' },
                { id: 'home', label: 'Home Loan', icon: Home, note: 'Secured Mortgage' },
                { id: 'vehicle', label: 'Vehicle Loan', icon: Car, note: 'Secured Auto' },
                { id: 'business', label: 'Business Loan', icon: Briefcase, note: 'Commercial' },
              ].map((prod) => {
                const Icon = prod.icon;
                const isSelected = formData.loan_type === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleLoanTypeChange(prod.id as LoanType)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#315CFD] bg-blue-50/60 dark:bg-blue-950/40 text-[#315CFD] dark:text-[#19B8A5]'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1.5" />
                    <div className="font-bold text-xs">{prod.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{prod.note}</div>
                  </button>
                );
              })}
            </div>
            {formData.loan_type === 'business' || formData.loan_type === 'vehicle' ? (
              <div className="mt-2.5 p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Prototype Model Scope:</strong> For {formData.loan_type} loans, evaluations utilize our financial affordability calculation engine; specialized institutional {formData.loan_type} credit risk models require authorized portfolio data.
                </span>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Loan Purpose */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Loan Purpose <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.loan_purpose}
                onChange={(e) => handleChange('loan_purpose', e.target.value)}
                placeholder="e.g. Home purchase, educational expense, working capital"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#315CFD]"
              />
              {errors.loan_purpose && <p className="mt-1 text-xs text-rose-500">{errors.loan_purpose}</p>}
            </div>

            {/* Requested Loan Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Requested Principal Amount (in Thousands) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.loan_amount}
                  onChange={(e) => handleChange('loan_amount', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden focus:ring-2 focus:ring-[#315CFD]"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                150 = ₹150,000 (enter any amount, e.g., 160 = ₹160,000). Expressed in thousands.
              </p>
            </div>

            {/* Tenure in Months */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Repayment Tenure (in Months) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.loan_amount_term}
                onChange={(e) => handleChange('loan_amount_term', parseInt(e.target.value) || 12)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden focus:ring-2 focus:ring-[#315CFD]"
              >
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
                <option value="60">60 Months (5 Years)</option>
                <option value="84">84 Months (7 Years)</option>
                <option value="120">120 Months (10 Years)</option>
                <option value="180">180 Months (15 Years)</option>
                <option value="240">240 Months (20 Years)</option>
                <option value="360">360 Months (30 Years)</option>
              </select>
            </div>

            {/* Interest Rate with clear disclosure */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Annual Interest Rate (% p.a.) <span className="text-slate-400 font-normal">(Disclosed Assumption)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.interest_rate}
                  onChange={(e) => handleChange('interest_rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden focus:ring-2 focus:ring-[#315CFD]"
                />
                <span className="absolute right-3.5 top-2.5 text-slate-400 text-sm font-semibold">%</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Transparent indicative benchmark rate used in the standard amortizing EMI formula.
              </p>
            </div>

            {/* Co-applicant indicator */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Co-Applicant Guarantee
              </label>
              <select
                value={formData.coapplicant_income > 0 ? 'yes' : 'no'}
                onChange={(e) => {
                  if (e.target.value === 'no') handleChange('coapplicant_income', 0);
                  else if (formData.coapplicant_income === 0) handleChange('coapplicant_income', 2000);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="yes">Yes (Co-applicant income included)</option>
                <option value="no">No (Sole applicant)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: APPLICANT AND EMPLOYMENT ─────────────────────────── */}
        <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-[#101B35] dark:text-white">
              2. Applicant & Employment Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verified income streams and employment durability. Sensitive government IDs are strictly excluded.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Employment category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Employment Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.employment_category}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  handleChange('employment_category', cat);
                  handleChange('self_employed', cat === 'salaried' ? 'No' : 'Yes');
                }}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="salaried">Salaried Corporate / Government</option>
                <option value="self_employed">Self-Employed Professional / Freelancer</option>
                <option value="business_owner">Business Owner / Partner</option>
              </select>
            </div>

            {/* Operating Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Tenure / Operating Duration (Months)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.employment_duration_months}
                onChange={(e) => handleChange('employment_duration_months', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
              />
            </div>

            {/* Monthly Gross Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Applicant Monthly Gross Income <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.applicant_income}
                  onChange={(e) => handleChange('applicant_income', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            {/* Monthly Net Take-Home */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Applicant Monthly Net Take-Home <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.net_monthly_income}
                  onChange={(e) => handleChange('net_monthly_income', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            {/* Co-applicant Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Co-Applicant Monthly Income
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.coapplicant_income}
                  onChange={(e) => handleChange('coapplicant_income', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            {/* Additional Verified Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Additional Documented Income
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.additional_monthly_income}
                  onChange={(e) => handleChange('additional_monthly_income', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            {/* Business Conditional Fields */}
            {isBusiness && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Annual Business Turnover
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.business_turnover || 0}
                    onChange={(e) => handleChange('business_turnover', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Annual Net Profit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.business_net_profit || 0}
                    onChange={(e) => handleChange('business_net_profit', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                  />
                </div>
              </>
            )}

            {/* Household demographics */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Marital Status
              </label>
              <select
                value={formData.married}
                onChange={(e) => handleChange('married', e.target.value as 'Yes' | 'No')}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="Yes">Married</option>
                <option value="No">Unmarried / Single</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Number of Financial Dependents
              </label>
              <select
                value={formData.dependents}
                onChange={(e) => handleChange('dependents', e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="0">0 Dependents</option>
                <option value="1">1 Dependent</option>
                <option value="2">2 Dependents</option>
                <option value="3+">3 or more (3+)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: EXISTING OBLIGATIONS ─────────────────────────────── */}
        <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-[#101B35] dark:text-white">
              3. Existing Financial Obligations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fixed commitments used to determine your Fixed-Obligation-to-Income (FOIR) and disposable surplus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Existing Monthly Loan EMIs
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={formData.existing_monthly_emi}
                  onChange={(e) => handleChange('existing_monthly_emi', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Other Monthly Debt Payments
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={formData.other_monthly_debt}
                  onChange={(e) => handleChange('other_monthly_debt', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Credit Card Outstanding Balance
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={formData.credit_card_outstanding}
                  onChange={(e) => handleChange('credit_card_outstanding', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Total Credit Card Limit
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={formData.credit_card_limit}
                  onChange={(e) => handleChange('credit_card_limit', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Estimated Essential Monthly Living Expenses
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={formData.essential_living_expenses}
                  onChange={(e) => handleChange('essential_living_expenses', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Non-debt household expenditure (groceries, utilities, healthcare, children education).
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: CREDIT HISTORY ────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-[#101B35] dark:text-white">
              4. Credit History Record
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Repayment discipline on past credit facilities. A missing credit history is treated as a distinct data state, never automatically classified as poor credit.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <input
                type="checkbox"
                id="has_history"
                checked={formData.has_credit_history}
                onChange={(e) => handleChange('has_credit_history', e.target.checked)}
                className="w-4 h-4 text-[#315CFD] rounded cursor-pointer"
              />
              <label htmlFor="has_history" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                I have an established credit bureau or formal loan history
              </label>
            </div>

            {formData.has_credit_history ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Repayment History Record
                  </label>
                  <select
                    value={formData.credit_history}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      handleChange('credit_history', val);
                      handleChange('late_payments_defaults', val === '0');
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="1">Satisfactory (No 30+ day arrears or write-offs)</option>
                    <option value="0">Documented Delinquencies / Past Arrears</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Credit Bureau Score (Optional / If Known)
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="900"
                    placeholder="e.g. 740"
                    value={formData.credit_score || ''}
                    onChange={(e) => handleChange('credit_score', parseInt(e.target.value) || null)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 p-2">
                Applicant without credit history will be evaluated primarily based on cash-flow stability and disposable income coverage without synthetic scoring penalties.
              </p>
            )}
          </div>
        </div>

        {/* ── SECTION 5: PROPERTY AND COLLATERAL (CONDITIONAL FOR SECURED) ── */}
        {isSecured && (
          <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-[#101B35] dark:text-white">
                5. Property & Collateral Valuation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Required for secured mortgage and vehicle facilities to verify Loan-to-Value (LTV) limits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Estimated Collateral Valuation (in Thousands)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.collateral_value || 0}
                    onChange={(e) => handleChange('collateral_value', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Down Payment / Margin (in Thousands)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.down_payment || 0}
                    onChange={(e) => handleChange('down_payment', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono-numbers focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Property Geographic Zone
                </label>
                <select
                  value={formData.property_area}
                  onChange={(e) => handleChange('property_area', e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="Semiurban">Semiurban (High liquidity growth corridor)</option>
                  <option value="Urban">Urban (Metropolitan municipal boundary)</option>
                  <option value="Rural">Rural (Agrarian / Non-metro zone)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 6: CONSENT AND VERIFICATION ─────────────────────────── */}
        <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-[#101B35] dark:text-white">
              6. Consent & Documentation Verification
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Income Documentation Status
              </label>
              <select
                value={formData.income_verification_status}
                onChange={(e) => handleChange('income_verification_status', e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="verified">Verified (Pay slips / Form 16 / Audited ITR provided)</option>
                <option value="pending">Pending Document Verification</option>
                <option value="self_declared">Self-Declared (Preliminary estimation only)</option>
              </select>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent_given}
                onChange={(e) => handleChange('consent_given', e.target.checked)}
                className="w-4 h-4 text-[#315CFD] rounded mt-0.5 cursor-pointer"
              />
              <label htmlFor="consent" className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer">
                I give consent for LoanIQ to calculate debt-serviceability ratios and execute algorithmic credit-risk assessment in accordance with the responsible AI and data minimization policy.
              </label>
            </div>
            {errors.consent_given && <p className="text-xs text-rose-500 pl-7">{errors.consent_given}</p>}

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="declaration"
                checked={formData.declaration_accepted}
                onChange={(e) => handleChange('declaration_accepted', e.target.checked)}
                className="w-4 h-4 text-[#315CFD] rounded mt-0.5 cursor-pointer"
              />
              <label htmlFor="declaration" className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer">
                I declare that the supplied monthly incomes, loan amounts, and debt obligations are truthful representations for academic and prototyping evaluation.
              </label>
            </div>
            {errors.declaration_accepted && <p className="text-xs text-rose-500 pl-7">{errors.declaration_accepted}</p>}
          </div>
        </div>

        {/* ── FORM ACTIONS ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Inputs
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-white bg-[#315CFD] hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Evaluating Affordability & Model...
              </>
            ) : (
              <>
                Assess Loan Application
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
