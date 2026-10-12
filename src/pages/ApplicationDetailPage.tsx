import React, { useState, useEffect } from 'react';
import { StoredApplication } from '../types';
import { generateApplicationPDF } from '../utils/pdfGenerator';
import {
  ArrowLeft,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Calendar,
  Clock,
  Info,
  FileCheck,
} from 'lucide-react';

interface ApplicationDetailPageProps {
  applicationId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({
  applicationId,
  onBack,
  onNavigate,
}) => {
  const [application, setApplication] = useState<StoredApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/applications/${applicationId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Application "${applicationId}" was not found in records.`);
          }
          throw new Error('Failed to load application details.');
        }
        const data = await res.json();
        setApplication(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Error retrieving record.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail().catch(() => {
      // Check cached
      const cached = localStorage.getItem('loaniq_applications');
      if (cached) {
        const found = JSON.parse(cached).find((a: any) => a.application_id === applicationId);
        if (found) {
          setApplication(found);
          setError(null);
        }
      }
    });
  }, [applicationId]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/applications/${applicationId}`, { method: 'DELETE' });
    } catch (err: any) {
      console.warn('Delete server warning:', err);
    }
    // Update local storage
    const cached = localStorage.getItem('loaniq_applications');
    if (cached) {
      const list = JSON.parse(cached).filter((a: any) => a.application_id !== applicationId);
      localStorage.setItem('loaniq_applications', JSON.stringify(list));
    }
    onBack();
  };

  const handleDownloadPDF = () => {
    if (application) {
      generateApplicationPDF(application);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-[#315CFD] mb-3"></div>
        <div>Loading record {applicationId}...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Record Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {error || `No record exists for application ID ${applicationId}.`}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#315CFD] rounded-lg"
        >
          Return to Application History
        </button>
      </div>
    );
  }

  const appAny = application as any;
  const outcome = application.assessment_outcome || appAny.prediction || 'Eligible for further consideration';
  const isEligible = outcome === 'Eligible for further consideration';
  const isReview =
    outcome === 'Refer for human review' ||
    outcome === 'Additional information required';
  const metrics = application.financial_metrics || {
    total_gross_monthly_income: (appAny.applicant_income || 6000) + (appAny.coapplicant_income || 0),
    total_net_monthly_income: (appAny.applicant_income || 6000) * 0.82,
    proposed_emi: 1250,
    annual_interest_rate_pct: 8.5,
    dti_pct: 12.5,
    foir_pct: 28.5,
    disposable_income: 3500,
    lti_ratio: 1.5,
    credit_utilization_pct: 20,
    ltv_pct: application.loan_type === 'home' ? 75 : null,
  };
  const inp = application.input_data || {
    loan_type: application.loan_type || 'home',
    loan_purpose: 'Residential Acquisition',
    loan_amount: appAny.loan_amount || 150,
    loan_amount_term: appAny.loan_amount_term || 240,
    interest_rate: 8.5,
    married: appAny.married || 'Yes',
    dependents: appAny.dependents || '1',
    education: appAny.education || 'Graduate',
    self_employed: appAny.self_employed || 'No',
    employment_category: 'salaried',
    employment_duration_months: 36,
    applicant_income: appAny.applicant_income || 6000,
    net_monthly_income: (appAny.applicant_income || 6000) * 0.82,
    additional_monthly_income: 0,
    coapplicant_income: appAny.coapplicant_income || 0,
    existing_monthly_emi: 400,
    other_monthly_debt: 100,
    credit_card_outstanding: 500,
    credit_card_limit: 4000,
    essential_living_expenses: 1500,
    has_credit_history: true,
    credit_history: appAny.credit_history || '1',
    property_area: appAny.property_area || 'Semiurban',
    income_verification_status: 'verified',
    consent_given: true,
    declaration_accepted: true,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-left space-y-8">
      {/* Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessment History
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#315CFD] hover:bg-blue-600 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF Report
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Deleting...' : 'Delete Record'}
          </button>
        </div>
      </div>

      {/* Main Detail Header Card */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-xs ${
          isEligible
            ? 'bg-linear-to-b from-teal-50/50 to-white dark:from-[#112838] dark:to-[#101b35] border-teal-200 dark:border-teal-800/80'
            : isReview
            ? 'bg-linear-to-b from-amber-50/50 to-white dark:from-[#2e2315] dark:to-[#101b35] border-amber-200 dark:border-amber-800/80'
            : 'bg-linear-to-b from-rose-50/50 to-white dark:from-[#2e1525] dark:to-[#101b35] border-rose-200 dark:border-rose-900/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-numbers font-semibold text-slate-500 dark:text-slate-400">
                APPLICATION REF: {application.application_id}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(application.submitted_at).toLocaleDateString()}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers uppercase">
                {application.loan_type} Loan
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#101B35] dark:text-white mt-1">
              Loan Assessment & Serviceability Record
            </h1>
          </div>

          <div
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 shrink-0 ${
              isEligible
                ? 'bg-teal-100/80 border-teal-300 dark:bg-teal-900/60 dark:border-teal-700 text-teal-800 dark:text-[#19B8A5]'
                : isReview
                ? 'bg-amber-100/80 border-amber-300 dark:bg-amber-900/60 dark:border-amber-700 text-amber-800 dark:text-amber-400'
                : 'bg-rose-100/80 border-rose-300 dark:bg-rose-900/60 dark:border-rose-700 text-rose-800 dark:text-rose-300'
            }`}
          >
            {isEligible ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isReview ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <div>
              <div className="text-xs font-bold leading-none">{application.assessment_outcome}</div>
              <div className="text-[10px] font-mono-numbers opacity-80 mt-0.5">
                {application.credit_risk_tier} Risk · {(application.calibrated_probability * 100).toFixed(1)}% likelihood
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {application.decision_rationale}
        </div>
      </div>

      {/* Ratios & Derived Financial Metrics */}
      <div className="bg-white dark:bg-[#111e3b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-[#101B35] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          Calculated Financial Metrics & Ratios
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-numbers">
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">Proposed Monthly EMI</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm text-[#315CFD] dark:text-[#19B8A5]">
              ₹{metrics.proposed_emi.toLocaleString()}/mo
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">FOIR (% Net Pay)</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {metrics.foir_pct}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">Debt-to-Income (DTI)</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {metrics.dti_pct}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">Disposable Monthly Buffer</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              ₹{metrics.disposable_income.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">Gross Combined Income</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              ₹{metrics.total_gross_monthly_income.toLocaleString()}/mo
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">Net Monthly Income</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              ₹{metrics.total_net_monthly_income.toLocaleString()}/mo
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">Loan-to-Income (LTI)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {metrics.lti_ratio}x
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-sans block mb-0.5">Loan-to-Value (LTV)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {metrics.ltv_pct !== null ? `${metrics.ltv_pct}%` : 'N/A (Unsecured)'}
            </span>
          </div>
        </div>
      </div>

      {/* Submitted Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111e3b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#101B35] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Applicant & Employment Inputs
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block mb-0.5">Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {inp.employment_category}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Tenure in Role</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {inp.employment_duration_months} Months
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Education</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{inp.education}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Dependents</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{inp.dependents}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Credit History Record</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {inp.credit_history === '1' ? 'Satisfactory (1.0)' : inp.credit_history === '0' ? 'Delinquent (0.0)' : 'No Prior Record'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Income Verification</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {inp.income_verification_status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111e3b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#101B35] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Facility & Obligation Inputs
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block mb-0.5">Requested Amount</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
                ₹{(inp.loan_amount * 1000).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Amortization Tenure</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
                {inp.loan_amount_term} Months
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Existing EMIs</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
                ₹{inp.existing_monthly_emi.toLocaleString()}/mo
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Living Expenses</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
                ₹{inp.essential_living_expenses.toLocaleString()}/mo
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Card Outstanding</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
                ₹{inp.credit_card_outstanding.toLocaleString()} / ₹{inp.credit_card_limit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Model Support</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {application.loan_product_support_status === 'fully_supported_ml' ? 'Full ML + Affordability' : 'Affordability Engine'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Factors */}
      {application.applicant_factors && application.applicant_factors.length > 0 && (
        <div className="bg-white dark:bg-[#111e3b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-[#101B35] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Contributing Decision Factors
          </h3>
          <div className="space-y-2">
            {application.applicant_factors.map((f, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white mr-2">
                    {f.factor}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      f.impact === 'positive'
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-[#19B8A5]'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                    }`}
                  >
                    {f.impact}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return to history */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Assessment History
        </button>

        <button
          onClick={() => onNavigate('apply')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#315CFD] hover:bg-blue-600 rounded-lg cursor-pointer"
        >
          Start New Assessment
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#101b35] rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Record?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove assessment record <strong className="font-mono text-slate-900 dark:text-white">{applicationId}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
