import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  iconOnly?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  iconOnly = false,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children ? (
        children
      ) : iconOnly ? (
        <button
          type="button"
          className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-0.5 rounded cursor-help transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
          aria-label="Information complémentaire"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      ) : null}

      {isVisible && (
        <span
          role="tooltip"
          className={`absolute z-50 ${positionClasses[position]} w-64 p-2.5 bg-stone-900 dark:bg-stone-950 text-stone-100 text-[11px] leading-relaxed rounded-xl shadow-xl border border-stone-700/80 pointer-events-none animate-in fade-in zoom-in-95 duration-150 font-normal`}
        >
          {content}
        </span>
      )}
    </span>
  );
};
