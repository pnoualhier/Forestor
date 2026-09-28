import React, { useState, useMemo } from 'react';
import { WorldMap } from '../components/map/WorldMap';
import { INDICATORS } from '../data/indicators';
import { COUNTRIES, Country } from '../data/countries';
import { useFraData } from '../hooks/useFraData';
import { useI18n } from '../i18n/I18nContext';
import { DataSource } from '../components/common/DataSource';
import { formatMetricValue } from '../domain/quality';
import { Globe2, Layers, Calendar, ArrowRight, X } from 'lucide-react';

interface MapPageProps {
  onSelectCountry: (iso3: string) => void;
  onNavigateAbout?: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onSelectCountry, onNavigateAbout }) => {
  const { t, locale } = useI18n();
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('forest_area');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [inspectIso, setInspectIso] = useState<string | null>(null);

  const selectedIndicator =
    INDICATORS.find((i) => i.id === selectedIndicatorId) || INDICATORS[0];

  // All 236 countries
  const allISOs = useMemo(() => COUNTRIES.map((c) => c.iso3), []);

  const { observations, summaries, loading, updatedAt } = useFraData({
    countryISOs: allISOs,
    tableNames: [selectedIndicator.tableName],
  });

  // Build map of values for selectedIndicator and selectedYear
  const valuesMap = useMemo(() => {
    const map = new Map<string, number | null>();

    observations.forEach((obs) => {
      if (
        obs.indicatorId === selectedIndicator.id &&
        (obs.year === selectedYear || Number(obs.year) === selectedYear)
      ) {
        map.set(obs.countryIso3, obs.value);
      }
    });

    // If summary already computed for 2025 fallback
    if (map.size === 0 && selectedYear === 2025) {
      summaries.forEach((sum, iso) => {
        if (selectedIndicator.id === 'forest_area') map.set(iso, sum.forestArea1000Ha);
        if (selectedIndicator.id === 'forest_proportion') map.set(iso, sum.forestProportionLand);
        if (selectedIndicator.id === 'primary_forest') map.set(iso, sum.primaryForest1000Ha);
        if (selectedIndicator.id === 'protected_forest') map.set(iso, sum.protectedForest1000Ha);
      });
    }

    return map;
  }, [observations, summaries, selectedIndicator.id, selectedYear]);

  const inspectedCountry = inspectIso ? COUNTRIES.find((c) => c.iso3 === inspectIso) : null;
  const inspectedValue = inspectIso ? valuesMap.get(inspectIso) : undefined;

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            {t.mapTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
            {t.mapSubtitle}
          </p>
        </div>
        <DataSource compact updatedAt={updatedAt} />
      </div>

      {/* Control Bar: Indicator & Year Selection */}
      <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Indicator picker */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs text-stone-500 font-medium">Variable :</span>
          <select
            value={selectedIndicatorId}
            onChange={(e) => setSelectedIndicatorId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-medium text-stone-900 dark:text-white focus:outline-none"
          >
            {INDICATORS.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {locale === 'fr' ? ind.nameFr : ind.nameEn} ({ind.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Year picker */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs text-stone-500 font-medium">Année :</span>
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-lg gap-1">
            {[1990, 2000, 2010, 2015, 2020, 2025].map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-2 py-1 rounded text-xs font-mono font-medium transition cursor-pointer ${
                  selectedYear === y
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Map */}
      <WorldMap
        valuesByIso3={valuesMap}
        unit={selectedIndicator.unit}
        indicatorLabel={locale === 'fr' ? selectedIndicator.nameFr : selectedIndicator.nameEn}
        selectedCountryIso3={inspectIso || undefined}
        onSelectCountry={(iso) => setInspectIso(iso)}
        year={selectedYear}
      />

      {/* Selected Country Inspection Drawer */}
      {inspectIso && inspectedCountry && (
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                {inspectIso}
              </span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                {locale === 'fr' ? inspectedCountry.nameFr : inspectedCountry.nameEn}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {locale === 'fr' ? selectedIndicator.nameFr : selectedIndicator.nameEn} ({selectedYear}) :{' '}
                <strong className="font-mono text-stone-900 dark:text-white">
                  {inspectedValue !== null && inspectedValue !== undefined
                    ? formatMetricValue(inspectedValue, selectedIndicator.unit, locale)
                    : t.dataNotReported}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectCountry(inspectIso)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition cursor-pointer"
            >
              <span>Voir la fiche complète</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setInspectIso(null)}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Methodological Context for Indicator */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-2 text-xs">
        <h4 className="font-semibold text-stone-900 dark:text-white">
          Méthodologie FAO — {locale === 'fr' ? selectedIndicator.nameFr : selectedIndicator.nameEn}
        </h4>
        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
          {locale === 'fr' ? selectedIndicator.descriptionFr : selectedIndicator.descriptionEn}
        </p>
        <p className="text-stone-500 italic">
          {locale === 'fr' ? selectedIndicator.methodologyFr : selectedIndicator.methodologyEn}
        </p>
      </div>

      <DataSource table={selectedIndicator.tableName} variable={selectedIndicator.variableName} updatedAt={updatedAt} onNavigateAbout={onNavigateAbout} />
    </div>
  );
};
