import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightText?: boolean;
}

export const LoanIQLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const svgSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Premium Shield + Upward Financial Growth Crest */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#101B35] via-[#182B4D] to-[#315CFD] p-[1.5px] shadow-sm relative group`}
      >
        <div className="w-full h-full bg-[#101B35] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle glowing ambient back-layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#315CFD]/30 via-transparent to-[#19B8A5]/40 opacity-70" />
          
          <svg
            width={svgSizes[size]}
            height={svgSizes[size]}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 transition-transform duration-300 group-hover:scale-105"
          >
            {/* Outer Shield silhouette */}
            <path
              d="M14 2.5L5.5 6.2C5.5 13.5 9 19.8 14 25.5C19 19.8 22.5 13.5 22.5 6.2L14 2.5Z"
              stroke="url(#shield_border_gradient)"
              strokeWidth="1.6"
              strokeLinejoin="round"
              fill="#101B35"
              fillOpacity="0.85"
            />
            {/* Financial Growth Path + Intelligent AI Peak */}
            <path
              d="M9 16L12.5 12.5L15 15L19 9.5"
              stroke="#19B8A5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Peak arrow dot */}
            <circle cx="19" cy="9.5" r="1.5" fill="#315CFD" stroke="#FFFFFF" strokeWidth="0.8" />
            {/* Intelligent Node / IQ spark */}
            <circle cx="12.5" cy="12.5" r="1" fill="#FFFFFF" />

            <defs>
              <linearGradient id="shield_border_gradient" x1="5.5" y1="2.5" x2="22.5" y2="25.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#315CFD" />
                <stop offset="0.6" stopColor="#19B8A5" />
                <stop offset="1" stopColor="#315CFD" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSizes[size]} font-extrabold tracking-tight leading-none ${
              lightText ? 'text-white' : 'text-[#101B35] dark:text-white'
            }`}
          >
            Loan<span className="text-[#315CFD] dark:text-[#19B8A5]">IQ</span>
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-400 mt-0.5">
            Fintech Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
