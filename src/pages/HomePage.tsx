import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileText,
  CheckCircle2,
  Calculator,
  User,
  Home,
  Car,
  Briefcase,
  Sparkles,
  TrendingUp,
  Percent,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react';
import heroImg from '../assets/images/fintech_hero_loan_analysis_1791782672045.jpg';
import { LoanCalculator } from '../components/LoanCalculator';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOpenAbout?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAbout }) => {
  const [selectedLoanType, setSelectedLoanType] = useState<string>('home');

  const loanOptions = [
    {
      id: 'personal',
      title: 'Personal Loan',
      subtitle: 'Unsecured Immediate Cash Flow',
      description: 'Ideal for emergency liquidity, debt consolidation, or life milestones without pledging collateral.',
      indicativeRate: 'From 11.5% p.a.',
      maxTenure: 'Up to 5 Years',
      icon: User,
      gradient: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
      badge: 'Unsecured',
    },
    {
      id: 'home',
      title: 'Home Loan',
      subtitle: 'Secured Residential Mortgage',
      description: 'Long-term financing for residential apartment purchases, villa construction, or plot development.',
      indicativeRate: 'From 8.5% p.a.',
      maxTenure: 'Up to 30 Years',
      icon: Home,
      gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
      badge: 'Prime Secured',
      popular: true,
    },
    {
      id: 'vehicle',
      title: 'Vehicle Loan',
      subtitle: 'Hypothecated Auto Financing',
      description: 'Competitive financing for new and pre-owned personal motor vehicles with asset hypothecation.',
      indicativeRate: 'From 9.0% p.a.',
      maxTenure: 'Up to 7 Years',
      icon: Car,
      gradient: 'from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20',
      badge: 'Asset-Backed',
    },
    {
      id: 'business',
      title: 'Business Loan',
      subtitle: 'Working Capital & Expansion',
      description: 'Accelerate commercial inventory, machinery acquisition, or cash flow reserves for enterprises.',
      indicativeRate: 'From 10.5% p.a.',
      maxTenure: 'Up to 10 Years',
      icon: Briefcase,
      gradient: 'from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20',
      badge: 'Commercial',
    },
  ];

  const handleSelectLoanOption = (loanId: string) => {
    onNavigate('apply', { loanType: loanId });
  };

  const handleApplyWithCalculatedValues = (amountK: number, tenureMonths: number, rate: number) => {
    onNavigate('apply', {
      initialAmount: amountK,
      initialTenure: tenureMonths,
      initialRate: rate,
    });
  };

  return (
    <div className="space-y-24 lg:space-y-32 pb-24 text-left">
      {/* ── 1. PREMIUM HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#315CFD]/15 via-[#19B8A5]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 space-y-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase text-[#315CFD] dark:text-[#19B8A5] bg-blue-50/90 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-900/60 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#19B8A5] animate-pulse" />
                AI-Powered Credit Risk & Eligibility Assessment
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-[#101B35] dark:text-white tracking-tight leading-[1.1]">
                Make Your Next Financial Decision with{' '}
                <span className="bg-gradient-to-r from-[#315CFD] via-[#2470FD] to-[#19B8A5] bg-clip-text text-transparent">
                  Confidence.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                Explore your loan eligibility with an AI-powered assessment designed to help you understand affordability, credit risk, and the factors that may influence a lending decision.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onNavigate('apply')}
                  className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#315CFD] to-[#254bd6] hover:from-[#2a52e8] hover:to-[#1f42c2] active:scale-[0.98] rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  Check Loan Eligibility
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#loan-options"
                  className="px-7 py-4 text-base font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer text-center"
                >
                  Explore Loan Options
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#19B8A5]" />
                  <span>Transparent assessments</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#315CFD]" />
                  <span>Secure application experience</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Zero impact on bureau score</span>
                </div>
              </div>
            </div>

            {/* Right Column: Custom Visual Composition & Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Visual Card */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-[#101B35] group">
                  <img
                    src={heroImg}
                    alt="LoanIQ Financial Intelligence Analysis"
                    className="w-full h-96 sm:h-[420px] object-cover opacity-85 group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-[#101B35]/50 to-transparent" />

                  {/* Top-Right Badge: Active Engine */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-mono-numbers text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#19B8A5] animate-ping" />
                    <span>RF-200 ENGINE ACTIVE</span>
                  </div>

                  {/* Bottom Hero Overlay Information Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#101B35]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700 shadow-xl text-left space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#19B8A5]" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Sample Underwriting Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        Illustrative Example
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Assessment Outcome</span>
                        <span className="font-extrabold text-[#19B8A5] text-sm">
                          Eligible for Review
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Fixed Obligation (FOIR)</span>
                        <span className="font-extrabold font-mono-numbers text-slate-900 dark:text-white text-sm">
                          29.8% (Healthy)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 1: Top-Left EMI Preview */}
                <div
                  className="hidden sm:flex absolute -top-5 -left-6 bg-white dark:bg-[#182B4D] rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xl items-center gap-3 animate-[bounce_6s_ease-in-out_infinite]"
                  style={{ animationDuration: '7s' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-[#315CFD] flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-medium">Est. Monthly EMI</span>
                    <span className="font-extrabold font-mono-numbers text-xs text-[#101B35] dark:text-white">
                      ₹12,450 /mo
                    </span>
                    <span className="text-[9px] text-slate-400 block">Sample 15-yr amort.</span>
                  </div>
                </div>

                {/* Floating Card 2: Right-Middle Credit Factors Card */}
                <div
                  className="hidden sm:flex absolute top-1/3 -right-6 bg-white dark:bg-[#182B4D] rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xl items-center gap-3 animate-[bounce_8s_ease-in-out_infinite]"
                  style={{ animationDuration: '9s' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/50 text-[#19B8A5] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-medium">Credit Risk Score</span>
                    <span className="font-extrabold text-xs text-[#19B8A5]">
                      Low Risk Profile
                    </span>
                    <span className="text-[9px] text-slate-400 block">Strong Repayment Tier</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. LOAN OPTIONS SECTION ────────────────────────────────────────── */}
      <section id="loan-options" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#315CFD] dark:text-[#19B8A5] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored Financial Facilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
              Explore Our Loan Products
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Choose the loan type that fits your goals. Select any product to pre-configure your assessment form.
            </p>
          </div>
          <button
            onClick={() => onNavigate('apply')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#315CFD] dark:text-[#19B8A5] hover:underline cursor-pointer"
          >
            Open Full Application <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loanOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectLoanOption(opt.id)}
                className="group relative bg-white dark:bg-[#111e3b] rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 hover:border-[#315CFD] dark:hover:border-[#19B8A5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 text-[#315CFD] dark:text-[#19B8A5] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {opt.badge}
                    </span>
                  </div>

                  {/* Title and descriptions */}
                  <h3 className="text-xl font-bold text-[#101B35] dark:text-white group-hover:text-[#315CFD] dark:group-hover:text-[#19B8A5] transition-colors">
                    {opt.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-400 mt-1 mb-3">
                    {opt.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {/* Rates & Bottom CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Indicative Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{opt.indicativeRate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Tenure</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{opt.maxTenure}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#315CFD] dark:text-[#19B8A5] group-hover:translate-x-1 transition-transform">
                    <span>Apply for this Loan</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. HOW LOANIQ HELPS (3-STEP PROCESS) ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#F8FAFC] to-white dark:from-[#101B35] dark:to-[#0c1427] rounded-3xl p-8 sm:p-14 border border-slate-200/90 dark:border-slate-800 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#315CFD] dark:text-[#19B8A5]">
              Streamlined Financial Evaluation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101B35] dark:text-white tracking-tight mt-1">
              How LoanIQ Works in 3 Clear Steps
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
              From your financial profile to an explainable assessment with clear decision factors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-left relative">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#315CFD] font-mono-numbers font-extrabold text-lg flex items-center justify-center">
                01
              </div>
              <h3 className="text-lg font-bold text-[#101B35] dark:text-white">
                Enter Financial Details
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Provide basic parameters including loan purpose, requested principal, monthly income, existing debt commitments, and credit repayment experience.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-left relative">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-[#19B8A5] font-mono-numbers font-extrabold text-lg flex items-center justify-center">
                02
              </div>
              <h3 className="text-lg font-bold text-[#101B35] dark:text-white">
                Review AI Assessment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Our dual engine instantly computes amortized monthly EMI, FOIR, and evaluates machine-learning risk predictions against historical benchmarks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-left relative">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 font-mono-numbers font-extrabold text-lg flex items-center justify-center">
                03
              </div>
              <h3 className="text-lg font-bold text-[#101B35] dark:text-white">
                Understand Key Factors
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Receive transparent feedback distinguishing positive drivers from limiting debt constraints, accompanied by an exportable PDF underwriting dossier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. INTERACTIVE EMI & AMORTIZATION CALCULATOR ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#315CFD] dark:text-[#19B8A5]">
            Plan Your Repayment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101B35] dark:text-white tracking-tight mt-1">
            Interactive Loan EMI Calculator
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Simulate your monthly installment, interest cost, and amortization schedule before submitting an application.
          </p>
        </div>

        <LoanCalculator onApplyWithValues={handleApplyWithCalculatedValues} />
      </section>

      {/* ── 5. WHY LOANIQ (FEATURE CARDS) ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#315CFD] dark:text-[#19B8A5]">
            Engineered for Transparency
          </span>
          <h2 className="text-3xl font-extrabold text-[#101B35] dark:text-white tracking-tight mt-1">
            Why Use LoanIQ for Financial Assessment?
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            A responsible, explainable platform combining standard financial rules with machine learning intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#315CFD] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Explainable Assessment Results
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Never get a black-box refusal. LoanIQ breaks down every evaluation into concrete strengths, limiting obligations, and recommended improvements.
            </p>
          </div>

          <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#19B8A5] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Institutional Affordability Calculations
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculates real metrics used by retail banks: amortized monthly EMI, FOIR (ceiling 50%), DTI, and post-obligation disposable buffers.
            </p>
          </div>

          <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Persistent Application History
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track and compare multiple borrowing scenarios over time with search, filtering by outcome and product, and tabular or card views.
            </p>
          </div>

          <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Executive PDF Underwriting Dossiers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate and download beautifully formatted institutional PDF reports suitable for research presentation, audit trails, and review.
            </p>
          </div>

          <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Transparent Boundaries & Limitations
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We explicitly state where model assumptions apply. Predictions are educational indications that never claim guaranteed loan approval.
            </p>
          </div>

          <div className="bg-white dark:bg-[#13203f] p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Indian Rupees (₹) Standard
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All financial calculations, EMI projections, income metrics, and history records follow standard Indian numbering and Rupee currency units.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL HIGH-CONTRAST CALL TO ACTION ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#101B35] via-[#182B4D] to-[#315CFD] text-white rounded-3xl p-10 sm:p-16 shadow-2xl space-y-6">
          {/* Subtle background geometric pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#19B8A5]">
              <Sparkles className="w-3.5 h-3.5" />
              Instant & Transparent Evaluation
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-xl mx-auto leading-tight">
              Ready to Understand Your Loan Eligibility?
            </h2>
            <p className="text-base text-slate-200 max-w-lg mx-auto leading-relaxed">
              Start your self-assessment in minutes and uncover your affordability ratios, debt headroom, and algorithmic risk tier.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('apply')}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-[#101B35] bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Start Free Loan Assessment
              </button>
              {onOpenAbout && (
                <button
                  onClick={onOpenAbout}
                  className="w-full sm:w-auto px-6 py-4 text-sm font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all cursor-pointer"
                >
                  Learn More About the System
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
