import React from 'react';
import { QualityStatus } from '../../types/indicator';
import { formatMetricValue } from '../../domain/quality';
import { useI18n } from '../../i18n/I18nContext';
import { CheckCircle2, AlertCircle, Calculator, HelpCircle } from 'lucide-react';

interface MetricBadgeProps {
  value: number | null | undefined;
  unit: string;
  status?: QualityStatus;
  isCalculated?: boolean;
  formula?: string;
  label?: string;
  year?: number | string;
  decimals?: number;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  value,
  unit,
  status = 'available',
  isCalculated = false,
  formula,
  label,
  year,
  decimals = 1,
}) => {
  const { t, locale } = useI18n();

  const formattedVal = formatMetricValue(value, undefined, locale, decimals);
  const isMissing = value === null || value === undefined || status === 'missing' || status === 'not_reported';

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-2xs hover:border-emerald-200 dark:hover:border-emerald-800 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium line-clamp-1">
          {label}
        </span>
        {year && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0">
            {year}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        {isMissing ? (
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 py-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium italic">{t.dataNotReported}</span>
          </div>
        ) : (
          <>
            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white font-mono">
              {formattedVal}
            </span>
            <span className="text-xs text-stone-500 font-medium font-sans">{unit}</span>
          </>
        )}
      </div>

      {/* Badges / Attribution */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/80 text-[10px]">
        {isCalculated ? (
          <span
            className="inline-flex items-center gap-1 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded font-mono"
            title={formula || 'Calcul Forestor'}
          >
            <Calculator className="w-2.5 h-2.5" />
            <span>{t.dataCalculated}</span>
          </span>
        ) : isMissing ? (
          <span className="text-stone-400 dark:text-stone-500 italic">
            {status === 'not_reported' ? t.dataNotReported : t.dataMissing}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded font-mono">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>{status === 'fao_estimate' ? t.dataEstimated : t.dataOfficial}</span>
          </span>
        )}

        {formula && (
          <span
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-help ml-auto"
            title={`Formule : ${formula}`}
          >
            <HelpCircle className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};
