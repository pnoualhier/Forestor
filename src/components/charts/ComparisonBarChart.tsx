import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { formatMetricValue } from '../../domain/quality';

export interface ComparisonBarItem {
  countryIso3: string;
  countryName: string;
  value: number | null;
  year?: number | string;
  color?: string;
}

interface ComparisonBarChartProps {
  title: string;
  unit: string;
  items: ComparisonBarItem[];
  source?: string;
  year?: number | string;
}

const PALETTE = [
  '#059669', // Emerald
  '#0284c7', // Sky
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#e11d48', // Rose
  '#0d9488', // Teal
  '#4f46e5', // Indigo
];

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  title,
  unit,
  items,
  source = 'FAO FRA 2025',
  year = 2025,
}) => {
  const { locale } = useI18n();
  const [hovered, setHovered] = useState<ComparisonBarItem | null>(null);

  if (items.length === 0) {
    return null;
  }

  const numericValues = items
    .map((i) => i.value)
    .filter((v) => v !== null && !isNaN(v)) as number[];
  const maxVal = numericValues.length > 0 ? Math.max(...numericValues, 1) : 1;

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-stone-900 dark:text-white">{title}</h4>
          <span className="text-[11px] text-stone-500 font-mono">Année de référence : {year}</span>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
          {unit}
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {items.map((item, idx) => {
          const color = item.color || PALETTE[idx % PALETTE.length];
          const isMissing = item.value === null || item.value === undefined;
          const pct = isMissing ? 0 : Math.max(3, (item.value! / maxVal) * 100);

          return (
            <div
              key={item.countryIso3}
              className="space-y-1.5 cursor-pointer"
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: isMissing ? '#a8a29e' : color }}
                  />
                  <span>{item.countryName}</span>
                  <span className="font-mono text-[10px] text-stone-400">({item.countryIso3})</span>
                </span>
                <span className="font-mono font-medium text-stone-900 dark:text-white">
                  {isMissing ? (
                    <span className="text-stone-400 dark:text-stone-500 italic text-[11px]">
                      Non communiqué
                    </span>
                  ) : (
                    formatMetricValue(item.value, unit, locale)
                  )}
                </span>
              </div>

              {/* Bar track */}
              <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden relative">
                {isMissing ? (
                  <div className="w-full h-full bg-stone-200/60 dark:bg-stone-700/40 repeating-linear-stripes" />
                ) : (
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hovered && (
        <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between font-mono">
          <span>
            {hovered.countryName} :{' '}
            <strong>
              {hovered.value !== null
                ? formatMetricValue(hovered.value, unit, locale)
                : 'Non communiqué'}
            </strong>
          </span>
          <span>Source : {source}</span>
        </div>
      )}
    </div>
  );
};
