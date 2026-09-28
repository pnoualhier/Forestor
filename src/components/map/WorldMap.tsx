import React, { useState, useEffect, useMemo, useRef } from 'react';
import { feature } from 'topojson-client';
import { COUNTRY_BY_NUMERIC, COUNTRY_BY_ISO3 } from '../../data/countries';
import { MapLegend } from './MapLegend';
import { formatMetricValue } from '../../domain/quality';
import { useI18n } from '../../i18n/I18nContext';
import { ZoomIn, ZoomOut, RotateCcw, MousePointerClick } from 'lucide-react';

interface WorldMapProps {
  valuesByIso3: Map<string, number | null>;
  unit: string;
  indicatorLabel: string;
  onSelectCountry: (iso3: string) => void;
  selectedCountryIso3?: string;
  year?: number | string;
}

const COLOR_SCALE = [
  '#d1fae5', // emerald-100 (lowest non-zero)
  '#6ee7b7', // emerald-300
  '#10b981', // emerald-500
  '#047857', // emerald-700
  '#064e3b', // emerald-900 (highest)
];

const MISSING_COLOR = '#e7e5e4'; // stone-200 for missing data

export const WorldMap: React.FC<WorldMapProps> = ({
  valuesByIso3,
  unit,
  indicatorLabel,
  onSelectCountry,
  selectedCountryIso3,
  year = 2025,
}) => {
  const { t, locale } = useI18n();
  const [geometries, setGeometries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/countries-110m.json')
      .then((res) => res.json())
      .then((topo) => {
        const geo: any = feature(topo, topo.objects.countries);
        setGeometries(geo.features || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load world map topology:', err);
        setLoading(false);
      });
  }, []);

  // Compute min/max for non-null values
  const { minVal, maxVal } = useMemo(() => {
    const valid: number[] = [];
    valuesByIso3.forEach((val) => {
      if (val !== null && val !== undefined && !isNaN(val) && val > 0) {
        valid.push(val);
      }
    });

    if (valid.length === 0) return { minVal: 0, maxVal: 100 };
    return {
      minVal: Math.min(...valid),
      maxVal: Math.max(...valid),
    };
  }, [valuesByIso3]);

  // Color lookup function
  const getColor = (iso3: string | undefined): string => {
    if (!iso3) return MISSING_COLOR;
    const val = valuesByIso3.get(iso3);
    if (val === null || val === undefined || isNaN(val)) {
      return MISSING_COLOR;
    }
    if (val <= 0) return '#f5f5f4'; // zero or non-forest

    const ratio = Math.min(1, Math.max(0, (val - minVal) / (maxVal - minVal || 1)));
    const idx = Math.min(COLOR_SCALE.length - 1, Math.floor(ratio * COLOR_SCALE.length));
    return COLOR_SCALE[idx];
  };

  // Convert coords to projection
  const project = (coords: [number, number]): [number, number] => {
    const x = ((coords[0] + 180) / 360) * 960;
    const lat = Math.max(-85, Math.min(85, coords[1]));
    const y = ((90 - lat) / 180) * 500;
    return [x, y];
  };

  const polyToPath = (rings: [number, number][][]) => {
    return rings
      .map(
        (ring) =>
          ring
            .map((pt, i) => {
              const [px, py] = project(pt);
              return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
            })
            .join(' ') + ' Z'
      )
      .join(' ');
  };

  const geomToPath = (geom: any): string => {
    if (!geom) return '';
    if (geom.type === 'Polygon') return polyToPath(geom.coordinates);
    if (geom.type === 'MultiPolygon')
      return geom.coordinates.map((poly: any) => polyToPath(poly)).join(' ');
    return '';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(4, Math.max(0.8, Number((prev + delta).toFixed(1)))));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const hoveredCountry = hoveredIso ? COUNTRY_BY_ISO3.get(hoveredIso) : null;
  const hoveredValue = hoveredIso ? valuesByIso3.get(hoveredIso) : undefined;

  return (
    <div className="relative w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950 overflow-hidden shadow-xs">
      {/* Top Header inside Map */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm text-xs">
        <div className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
          <span>{indicatorLabel}</span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px]">
            {year}
          </span>
        </div>
        <div className="text-[11px] text-stone-500 font-mono">Unité : {unit}</div>
      </div>

      {/* Zoom / Reset Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs p-1 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <button
          onClick={() => handleZoom(0.3)}
          className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title={t.zoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.3)}
          className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title={t.zoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title={t.resetZoom}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Canvas */}
      <div
        className={`w-full h-[480px] cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
            Chargement de la topologie mondiale...
          </div>
        ) : (
          <svg
            viewBox="0 0 960 500"
            className="w-full h-full select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background Ocean */}
            <rect width="960" height="500" fill="#f8fafc" className="dark:fill-stone-950" />

            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
              style={{ transformOrigin: '480px 250px', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
            >
              {geometries.map((feature: any) => {
                const numericId = String(feature.id).padStart(3, '0');
                const country = COUNTRY_BY_NUMERIC.get(numericId);
                const iso3 = country?.iso3;
                const pathData = geomToPath(feature.geometry);
                const fillColor = getColor(iso3);
                const isSelected = selectedCountryIso3 && selectedCountryIso3 === iso3;
                const isHovered = hoveredIso && hoveredIso === iso3;

                return (
                  <path
                    key={feature.id}
                    d={pathData}
                    fill={fillColor}
                    stroke={isSelected ? '#059669' : isHovered ? '#0f766e' : '#ffffff'}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.6}
                    className="cursor-pointer transition-colors duration-150 outline-none"
                    onMouseEnter={(e) => {
                      if (iso3) {
                        setHoveredIso(iso3);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (iso3) {
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => setHoveredIso(null)}
                    onClick={() => {
                      if (iso3) onSelectCountry(iso3);
                    }}
                  />
                );
              })}
            </g>
          </svg>
        )}
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredIso && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 bg-stone-900 text-stone-100 text-xs rounded-xl p-3 shadow-xl border border-stone-700 min-w-[180px] space-y-1"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
        >
          <div className="font-semibold text-emerald-400 flex items-center justify-between gap-2">
            <span>{hoveredCountry ? (locale === 'fr' ? hoveredCountry.nameFr : hoveredCountry.nameEn) : hoveredIso}</span>
            <span className="font-mono text-[10px] text-stone-400">({hoveredIso})</span>
          </div>

          <div className="text-[11px] text-stone-300">
            {hoveredValue !== null && hoveredValue !== undefined ? (
              <span className="font-mono font-bold text-white text-sm">
                {formatMetricValue(hoveredValue, unit, locale)}
              </span>
            ) : (
              <span className="italic text-amber-300">{t.dataNotReported}</span>
            )}
          </div>

          <div className="text-[10px] text-stone-400 flex items-center gap-1 pt-1 border-t border-stone-800">
            <MousePointerClick className="w-3 h-3 text-emerald-400" />
            <span>{t.clickToInspect}</span>
          </div>
        </div>
      )}

      {/* Bottom Legend */}
      <div className="absolute bottom-4 left-4 z-10 max-w-xs">
        <MapLegend min={minVal} max={maxVal} unit={unit} colors={COLOR_SCALE} />
      </div>
    </div>
  );
};
