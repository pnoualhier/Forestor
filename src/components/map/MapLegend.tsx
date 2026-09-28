import React from 'react';
import { formatMetricValue } from '../../domain/quality';
import { useI18n } from '../../i18n/I18nContext';

interface MapLegendProps {
  min: number;
  max: number;
  unit: string;
  colors: string[];
}

export const MapLegend: React.FC<MapLegendProps> = ({ min, max, unit, colors }) => {
  const { t, locale } = useI18n();

  const steps = colors.map((col, idx) => {
    const fraction = idx / (colors.length - 1 || 1);
    const val = min + fraction * (max - min);
    return {
      color: col,
      value: val,
    };
  });

  return (
    <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-md text-xs space-y-2">
      <div className="flex items-center justify-between gap-4 font-medium text-stone-700 dark:text-stone-300">
        <span>{t.legendTitle}</span>
        <span className="font-mono text-[10px] text-stone-500">({unit})</span>
      </div>

      {/* Gradient bar & scale marks */}
      <div className="space-y-1">
        <div className="flex h-3 rounded overflow-hidden">
          {colors.map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-stone-500">
          <span>{formatMetricValue(min, undefined, locale, min > 100 ? 0 : 1)}</span>
          <span>{formatMetricValue((min + max) / 2, undefined, locale, max > 100 ? 0 : 1)}</span>
          <span>{formatMetricValue(max, undefined, locale, max > 100 ? 0 : 1)}</span>
        </div>
      </div>

      {/* Missing data indicator */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-[11px] text-stone-500">
        <span className="w-3.5 h-3.5 rounded border border-stone-300 bg-stone-200/60 dark:bg-stone-800 dark:border-stone-700 shrink-0 repeating-stripes" />
        <span className="italic">{t.legendNoData}</span>
      </div>
    </div>
  );
};
