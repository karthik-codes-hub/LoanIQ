import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Award,
  Layers,
  Scale,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssessment: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onStartAssessment,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does LoanIQ calculate my loan eligibility and risk?',
      a: 'LoanIQ uses a dual-engine architecture: first, financial engineering formulas calculate real institutional ratios (Amortized monthly EMI, Fixed-Obligation-to-Income Ratio FOIR, Debt-to-Income DTI, and disposable cash reserves). Second, an ensemble Random Forest classifier trained on historical credit benchmarks evaluates probability of default.',
    },
    {
      q: 'Is LoanIQ an actual bank or lender?',
      a: 'No. LoanIQ is an advanced fintech research prototype and underwriting simulation platform built to demonstrate responsible AI, financial explainability, and transparent credit decision drivers.',
    },
    {
      q: 'Are my financial details shared with credit bureaus?',
      a: 'No. LoanIQ operates strictly for evaluation and self-assessment purposes without transmitting data to external third-party agencies or advertising networks. Your information remains localized to your session and demonstration database.',
    },
    {
      q: 'What is FOIR (Fixed-Obligation-to-Income Ratio)?',
      a: 'FOIR represents the percentage of your monthly take-home income already committed to non-discretionary obligations, such as existing EMIs, rent, and card dues. Most Indian lending institutions establish a ceiling between 45% and 55% for sustainable borrowing.',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#101B35] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 text-left my-8">
        {/* Header with midnight gradient */}
        <div className="bg-gradient-to-r from-[#101B35] via-[#182B4D] to-[#315CFD] p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-[#19B8A5] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            University Research & Fintech Demonstration
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            About LoanIQ Intelligence
          </h2>
          <p className="text-sm text-slate-200 mt-2 max-w-xl leading-relaxed">
            An AI-powered credit risk and loan affordability system designed to provide borrowers with transparent, explainable financial evaluations.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Section 1: The Three Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-[#315CFD] flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#101B35] dark:text-white">Institutional Affordability</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Rigorous financial formulas computing monthly EMI, FOIR, and post-obligation disposable buffers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-[#19B8A5] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#101B35] dark:text-white">Machine Learning Rigor</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                200-estimator Random Forest classifier trained on validated historical loan underwriting patterns.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#101B35] dark:text-white">Transparent Explainability</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Granular breakdowns of strengths, limiting factors, and downloadable institutional PDF dossiers.
              </p>
            </div>
          </div>

          {/* Section 2: Interactive FAQ */}
          <div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white mb-3">
              Frequently Asked Questions
            </h3>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13203f] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-[#315CFD]' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Responsible AI & Ethics Statement */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#315CFD] dark:text-[#19B8A5]">
              <ShieldCheck className="w-4 h-4" />
              Responsible AI & Algorithmic Fairness Commitment
            </div>
            <p className="leading-relaxed">
              LoanIQ excludes demographic proxies that could bias financial decisions. Algorithms assess solely demonstrable financial serviceability, credit discipline, and debt ratios. All model outputs remain subject to human oversight.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0c1427] border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Version 2.4.0 · Scikit-learn Random Forest Model
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartAssessment();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#315CFD] to-[#19B8A5] text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              Start Loan Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
