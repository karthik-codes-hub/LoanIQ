import React, { useState } from 'react';
import { Calculator, ArrowRight, HelpCircle } from 'lucide-react';

interface LoanCalculatorProps {
  onApplyWithValues?: (amount: number, tenureMonths: number, rate: number) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onApplyWithValues }) => {
  // Principal in Thousands (e.g. 500 = ₹5,00,000)
  const [loanAmountK, setLoanAmountK] = useState<number>(500);
  const [annualRate, setAnnualRate] = useState<number>(8.75);
  const [tenureYears, setTenureYears] = useState<number>(15);

  const tenureMonths = tenureYears * 12;
  const principalActual = loanAmountK * 1000;

  // Monthly interest formula
  const monthlyRate = annualRate / 12 / 100;
  const growth = Math.pow(1 + monthlyRate, tenureMonths);
  const emi =
    annualRate > 0 && isFinite(growth) && growth > 1
      ? (principalActual * monthlyRate * growth) / (growth - 1)
      : principalActual / tenureMonths;

  const totalRepayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - principalActual);
  const interestRatio = totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 0;
  const principalRatio = 100 - interestRatio;

  return (
    <div className="bg-white dark:bg-[#111e3b] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Interactive Configuration Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-8 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#315CFD] dark:text-[#19B8A5]">
                Financial Affordability Simulator
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#101B35] dark:text-white mt-0.5">
                Calculate Monthly EMI & Amortization
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#315CFD] flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
          </div>

          {/* Slider 1: Loan Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Loan Amount (Principal)
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="10"
                  value={loanAmountK}
                  onChange={(e) => setLoanAmountK(Math.max(10, Number(e.target.value) || 10))}
                  className="w-20 font-mono-numbers text-sm font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden text-right"
                />
                <span className="text-xs font-semibold text-slate-500">K</span>
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="25"
              value={loanAmountK}
              onChange={(e) => setLoanAmountK(Number(e.target.value))}
              className="w-full accent-[#315CFD] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono-numbers text-slate-400">
              <span>₹50,000 (50K)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ₹{principalActual.toLocaleString('en-IN')}
              </span>
              <span>₹50,00,000 (5M)</span>
            </div>
          </div>

          {/* Slider 2: Annual Interest Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Interest Rate (p.a.)
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="number"
                  min="4"
                  max="25"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Math.max(1, Number(e.target.value) || 1))}
                  className="w-16 font-mono-numbers text-sm font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden text-right"
                />
                <span className="text-xs font-semibold text-slate-500">%</span>
              </div>
            </div>
            <input
              type="range"
              min="6"
              max="18"
              step="0.25"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full accent-[#315CFD] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono-numbers text-slate-400">
              <span>6.0%</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{annualRate.toFixed(2)}% p.a.</span>
              <span>18.0%</span>
            </div>
          </div>

          {/* Slider 3: Loan Tenure */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Loan Tenure
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value) || 1))}
                  className="w-12 font-mono-numbers text-sm font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden text-right"
                />
                <span className="text-xs font-semibold text-slate-500">Yrs</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#315CFD] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono-numbers text-slate-400">
              <span>1 Year (12 mo)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {tenureYears} Years ({tenureMonths} mo)
              </span>
              <span>30 Years (360 mo)</span>
            </div>
          </div>
        </div>

        {/* Right Output Summary Column */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#101B35] to-[#182B4D] p-6 sm:p-10 text-white flex flex-col justify-between text-left">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#19B8A5]">
                Repayment Breakdown
              </span>
              <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-white/10 rounded-full">
                Indicative Estimate
              </span>
            </div>

            {/* Big EMI Highlight */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <span className="text-xs text-slate-300 block">Estimated Monthly EMI</span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers text-white tracking-tight">
                ₹{Math.round(emi).toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-400 ml-1">/month</span>
              </div>
            </div>

            {/* Visual Amortization Proportion Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#315CFD] inline-block" />
                  Principal ({principalRatio.toFixed(1)}%)
                </span>
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19B8A5] inline-block" />
                  Interest ({interestRatio.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#315CFD] h-full transition-all duration-300"
                  style={{ width: `${principalRatio}%` }}
                />
                <div
                  className="bg-[#19B8A5] h-full transition-all duration-300"
                  style={{ width: `${interestRatio}%` }}
                />
              </div>
            </div>

            {/* Financial Summary Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Total Interest</span>
                <span className="font-bold font-mono-numbers text-sm text-[#19B8A5]">
                  ₹{Math.round(totalInterest).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Repayment</span>
                <span className="font-bold font-mono-numbers text-sm text-white">
                  ₹{Math.round(totalRepayment).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA & Disclaimer */}
          <div className="pt-6 space-y-3">
            {onApplyWithValues && (
              <button
                onClick={() => onApplyWithValues(loanAmountK, tenureMonths, annualRate)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#315CFD] to-[#19B8A5] hover:opacity-95 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                Apply with these Terms
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <p className="text-[10px] text-slate-400 leading-tight">
              *Calculated with compound monthly reducing balance. Final terms, rates, and approval depend on applicant credit evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
