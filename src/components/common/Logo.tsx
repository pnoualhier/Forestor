import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem SVG */}
      <div className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-1 flex items-center justify-center shadow-sm shadow-emerald-950/20 text-white shrink-0 overflow-hidden ring-1 ring-emerald-500/30`}>
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle rings */}
          <circle cx="20" cy="20" r="16" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="20" cy="20" r="11" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
          
          {/* Tree trunk */}
          <rect x="18.5" y="27" width="3" height="6" rx="0.5" fill="#fef3c7" opacity="0.9" />
          
          {/* Layered canopy */}
          <polygon points="20,8 10,21 16,21 9,28 31,28 24,21 30,21" fill="#34d399" />
          <polygon points="20,11 12,21 17,21 11,27 29,27 23,21 28,21" fill="#6ee7b7" opacity="0.9" />
          
          {/* Top highlight dot */}
          <circle cx="20" cy="7.5" r="1.5" fill="#ecfdf5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold tracking-tight text-lg text-stone-900 dark:text-white">
              FORESTOR
            </span>
            <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
              FRA 2025
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono tracking-wider uppercase mt-1 leading-none">
            Global Forest Assessment
          </span>
        </div>
      )}
    </div>
  );
};
