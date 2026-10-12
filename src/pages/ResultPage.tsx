import React from 'react';
import { AssessmentResult } from '../types';
import { generateApplicationPDF } from '../utils/pdfGenerator';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Download,
  RotateCcw,
  List,
  Home,
  Info,
  Calculator,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

interface ResultPageProps {
  result: AssessmentResult;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onNavigate }) => {
  const metrics = result.financial_metrics;
  const isEligible = result.assessment_outcome === 'Eligible for further consideration';
  const isHumanReview =
    result.assessment_outcome === 'Refer for human review' ||
    result.assessment_outcome === 'Additional information required';

  const handleDownloadPDF = () => {
    generateApplicationPDF(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-left space-y-8">
      {/* Reference Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Assessment Output · Reference ID
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[#101B35] dark:text-white mt-0.5">
            {result.application_id}
          </h1>
        </div>
        <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400">
          <div>Evaluated: {new Date(result.submitted_at).toLocaleDateString()}</div>
          <div className="font-mono-numbers">{new Date(result.submitted_at).toLocaleTimeString()}</div>
        </div>
      </div>

      {/* ── 1. MAIN ASSESSMENT STATUS CARD ─────────────────────────────────── */}
      <div
        className={`rounded-2xl p-6 sm:p-10 border shadow-xs transition-all ${
          isEligible
            ? 'bg-linear-to-b from-teal-50/60 to-white dark:from-[#112838] dark:to-[#101b35] border-teal-200 dark:border-teal-800/80'
            : isHumanReview
            ? 'bg-linear-to-b from-amber-50/60 to-white dark:from-[#2e2315] dark:to-[#101b35] border-amber-200 dark:border-amber-800/80'
            : 'bg-linear-to-b from-rose-50/60 to-white dark:from-[#2e1525] dark:to-[#101b35] border-rose-200 dark:border-rose-900/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                isEligible
                  ? 'bg-[#19B8A5] text-white'
                  : isHumanReview
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {isEligible ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : isHumanReview ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>
            <div className="space-y-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isEligible
                    ? 'text-teal-700 dark:text-[#19B8A5]'
                    : isHumanReview
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                Assessment Recommendation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
                {result.assessment_outcome}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed pt-1">
                {result.decision_rationale}
              </p>
            </div>
          </div>

          {/* Model Serviceability Probability & Risk Tier */}
          <div className="sm:text-right shrink-0 bg-white/90 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Credit Risk Tier
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {result.credit_risk_tier} Risk
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Estimated Serviceability
            </div>
            <div className="text-xl font-bold font-mono-numbers text-slate-900 dark:text-white">
              {(result.calibrated_probability * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[170px]">
              * Model probability based on historical training benchmark.
            </div>
          </div>
        </div>

        {/* Quick facility summary strip */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-500">Loan Product</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5 uppercase">
              {result.loan_type} Loan
            </div>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500">Requested Principal</span>
            <div className="font-bold font-mono-numbers text-slate-900 dark:text-white mt-0.5">
              ₹{(result.input_data.loan_amount * 1000).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500">Proposed Monthly EMI</span>
            <div className="font-bold font-mono-numbers text-slate-900 dark:text-white mt-0.5 text-[#315CFD] dark:text-[#19B8A5]">
              ₹{metrics.proposed_emi.toLocaleString()}/mo
            </div>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500">Model Pipeline</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              Hybrid ML & Affordability (v{result.model_version})
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. FINANCIAL RATIOS & DEFINITIONS ──────────────────────────────── */}
      <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#101B35] dark:text-white">
              Financial Affordability & Leverage Ratios
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Key institutional metrics computed from verified income and obligation entries.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Benchmark Ceiling: FOIR ≤ 50%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* FOIR Block */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                Fixed-Obligation-to-Income (FOIR)
              </span>
              <span
                className={`font-mono-numbers font-bold text-sm ${
                  metrics.foir_pct <= 45
                    ? 'text-teal-600 dark:text-[#19B8A5]'
                    : metrics.foir_pct <= 55
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {metrics.foir_pct}%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              <strong>Definition:</strong> Total fixed monthly obligations (existing debt payments + proposed EMI) divided by net monthly take-home income, multiplied by 100.
            </p>
          </div>

          {/* DTI Block */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                Debt-to-Income Ratio (DTI)
              </span>
              <span className="font-mono-numbers font-bold text-sm text-slate-900 dark:text-white">
                {metrics.dti_pct}%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              <strong>Definition:</strong> Prior existing monthly debt payments divided by gross monthly income, multiplied by 100.
            </p>
          </div>

          {/* Disposable Income Block */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                Monthly Disposable Income Buffer
              </span>
              <span
                className={`font-mono-numbers font-bold text-sm ${
                  metrics.disposable_income >= 1000
                    ? 'text-teal-600 dark:text-[#19B8A5]'
                    : metrics.disposable_income > 0
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                ₹{metrics.disposable_income.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              <strong>Definition:</strong> Net monthly income minus existing debt obligations, proposed EMI, and essential living expenses.
            </p>
          </div>

          {/* LTV or Credit Utilization */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                {metrics.ltv_pct !== null ? 'Loan-to-Value (LTV)' : 'Credit Card Utilization'}
              </span>
              <span className="font-mono-numbers font-bold text-sm text-slate-900 dark:text-white">
                {metrics.ltv_pct !== null
                  ? `${metrics.ltv_pct}%`
                  : metrics.credit_utilization_pct !== null
                  ? `${metrics.credit_utilization_pct}%`
                  : 'N/A'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              {metrics.ltv_pct !== null
                ? 'Requested loan amount divided by verified collateral value, multiplied by 100. Standard institutional ceiling is 80%.'
                : 'Revolving card balance divided by revolving credit limit, multiplied by 100. Optimal threshold is below 30%.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. CONTRIBUTING DECISION FACTORS ──────────────────────────────── */}
      <div className="bg-white dark:bg-[#111e3b] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#101B35] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Identified Decision Factors & Risk Drivers
        </h3>

        <div className="space-y-3">
          {result.applicant_factors.map((f, i) => {
            const isPos = f.impact === 'positive';
            const isNeg = f.impact === 'negative';
            return (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {f.factor}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isPos
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-[#19B8A5]'
                          : isNeg
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {f.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
                {f.importance ? (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400">Global Weight</span>
                    <div className="text-xs font-mono-numbers font-semibold text-slate-700 dark:text-slate-300">
                      {f.importance}%
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. MISSING ITEMS & RECOMMENDED NEXT STEPS ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing or Unverified Items */}
        <div className="bg-white dark:bg-[#111e3b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-[#101B35] dark:text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500" />
            Verification & Outstanding Items
          </h4>
          {result.missing_or_unverified_items.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {result.missing_or_unverified_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">
              All essential income documentation and credit profile parameters have been provided.
            </p>
          )}
        </div>

        {/* Specific Next Steps */}
        <div className="bg-white dark:bg-[#111e3b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-[#101B35] dark:text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#315CFD]" />
            Recommended Next Steps
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {result.next_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#315CFD] font-bold">→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 5. EDUCATIONAL DISCLAIMER ─────────────────────────────────────── */}
      <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#315CFD] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">Computational Estimate Notice: </span>
          <span>
            This assessment is produced for educational research and prototyping demonstration. It does not constitute a legally binding lending offer or commercial credit guarantee.
          </span>
        </div>
      </div>

      {/* ── 6. ACTION BUTTONS ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#315CFD] hover:bg-blue-600 active:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>

          <button
            onClick={() => onNavigate('application-detail', { id: result.application_id })}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <List className="w-4 h-4" />
            Full Record Breakdown
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('history')}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            Assessment History
          </button>

          <button
            onClick={() => onNavigate('apply')}
            className="px-4 py-2.5 text-sm font-medium text-[#315CFD] dark:text-[#19B8A5] hover:underline transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
