import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { formatMetricValue } from '../../domain/quality';

export interface TrendDataPoint {
  year: number | string;
  value: number | null;
  status?: string;
}

interface TrendLineChartProps {
  title: string;
  countryName: string;
  unit: string;
  data: TrendDataPoint[];
  source?: string;
  color?: string;
  height?: number;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  title,
  countryName,
  unit,
  data,
  source = 'FAO FRA 2025',
  color = '#059669', // Emerald
  height = 240,
}) => {
  const { locale } = useI18n();
  const [hoveredPoint, setHoveredPoint] = useState<TrendDataPoint | null>(null);

  // Filter valid numeric values to calculate min/max
  const validPoints = data.filter((d) => d.value !== null && typeof d.value === 'number') as {
    year: number | string;
    value: number;
  }[];

  if (data.length === 0 || validPoints.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-xs text-stone-400 italic">
        Aucune donnée temporelle disponible pour cet indicateur
      </div>
    );
  }

  const values = validPoints.map((p) => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  // Add 10% breathing room on Y axis
  const yPadding = (maxVal - minVal) * 0.1 || (maxVal > 0 ? maxVal * 0.1 : 1);
  const yMin = Math.max(0, minVal - yPadding);
  const yMax = maxVal + yPadding;

  const width = 600;
  const chartPadding = { top: 25, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - chartPadding.left - chartPadding.right;
  const innerHeight = height - chartPadding.top - chartPadding.bottom;

  // X coordinate calculation
  const getX = (index: number) => {
    return chartPadding.left + (index / (data.length - 1 || 1)) * innerWidth;
  };

  // Y coordinate calculation
  const getY = (val: number | null) => {
    if (val === null) return innerHeight + chartPadding.top;
    return (
      chartPadding.top +
      innerHeight -
      ((val - yMin) / (yMax - yMin || 1)) * innerHeight
    );
  };

  // Build SVG path segments (breaking on nulls to prevent silent interpolation)
  const pathSegments: string[] = [];
  let currentSegment: string[] = [];

  data.forEach((p, idx) => {
    if (p.value !== null) {
      const x = getX(idx);
      const y = getY(p.value);
      if (currentSegment.length === 0) {
        currentSegment.push(`M ${x} ${y}`);
      } else {
        currentSegment.push(`L ${x} ${y}`);
      }
    } else {
      if (currentSegment.length > 0) {
        pathSegments.push(currentSegment.join(' '));
        currentSegment = [];
      }
    }
  });
  if (currentSegment.length > 0) {
    pathSegments.push(currentSegment.join(' '));
  }

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-900 dark:text-white">{title}</h4>
          <span className="text-[11px] text-stone-500 font-sans">{countryName}</span>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
          {unit}
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[340px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y Axis Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = chartPadding.top + innerHeight * (1 - pct);
            const val = yMin + pct * (yMax - yMin);
            return (
              <g key={pct}>
                <line
                  x1={chartPadding.left}
                  y1={y}
                  x2={width - chartPadding.right}
                  y2={y}
                  stroke="#e7e5e4"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={chartPadding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-stone-400"
                >
                  {formatMetricValue(val, undefined, locale, val > 1000 ? 0 : 1)}
                </text>
              </g>
            );
          })}

          {/* Connected Lines */}
          {pathSegments.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Points & Labels */}
          {data.map((p, idx) => {
            const x = getX(idx);
            const y = getY(p.value);
            const isMissing = p.value === null;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* X Axis Year Label */}
                <text
                  x={x}
                  y={chartPadding.top + innerHeight + 20}
                  textAnchor="middle"
                  className="text-[11px] font-mono fill-stone-500 font-medium"
                >
                  {p.year}
                </text>

                {isMissing ? (
                  // Dashed cross for missing data
                  <g transform={`translate(${x}, ${chartPadding.top + innerHeight})`}>
                    <circle r="4" fill="#f5f5f4" stroke="#a8a29e" strokeDasharray="2 2" strokeWidth="1.5" />
                  </g>
                ) : (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#ffffff"
                      stroke={color}
                      strokeWidth="2.5"
                      className="hover:r-6 transition-all"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip as mandated by Section 10 */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-stone-900 text-stone-100 text-[11px] rounded-lg p-2.5 shadow-lg border border-stone-700 pointer-events-none space-y-1">
            <div className="font-semibold text-emerald-400">{countryName}</div>
            <div>{title}</div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-stone-400">Année :</span>
              <strong className="text-white">{hoveredPoint.year}</strong>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-stone-400">Valeur :</span>
              <strong className="text-white">
                {hoveredPoint.value !== null
                  ? `${formatMetricValue(hoveredPoint.value, unit, locale)}`
                  : 'Non communiqué'}
              </strong>
            </div>
            <div className="text-[10px] text-stone-400 border-t border-stone-800 pt-1">
              Source : {source}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-2 font-mono">
        <span>Évolution observée</span>
        <span>Pas d'interpolation artificielle</span>
      </div>
    </div>
  );
};
