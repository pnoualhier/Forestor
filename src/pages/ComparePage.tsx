import React, { useState } from 'react';
import { COUNTRIES, Country } from '../data/countries';
import { INDICATORS } from '../data/indicators';
import { useFraData } from '../hooks/useFraData';
import { ComparisonBarChart, ComparisonBarItem } from '../components/charts/ComparisonBarChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { DataSource } from '../components/common/DataSource';
import { useI18n } from '../i18n/I18nContext';
import { formatMetricValue } from '../domain/quality';
import { Plus, X, BarChart3, Layers, Calendar, Info } from 'lucide-react';

interface ComparePageProps {
  initialCountries?: string[];
  onSelectCountry: (iso3: string) => void;
  onNavigateAbout?: () => void;
}

const DEFAULT_COMPARE = ['FRA', 'DEU', 'ESP', 'ITA', 'SWE'];

export const ComparePage: React.FC<ComparePageProps> = ({
  initialCountries = DEFAULT_COMPARE,
  onSelectCountry,
  onNavigateAbout,
}) => {
  const { t, locale } = useI18n();
  const [selectedISOs, setSelectedISOs] = useState<string[]>(initialCountries);
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('forest_area');
  const [addQuery, setAddQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const selectedIndicator = INDICATORS.find((i) => i.id === selectedIndicatorId) || INDICATORS[0];

  // Fetch data for all selected countries
  const { summaries, observations, loading, updatedAt } = useFraData({
    countryISOs: selectedISOs,
    tableNames: [
      'extentOfForest',
      'forestCharacteristics',
      'forestAreaChange',
      'forestAreaWithinProtectedAreas',
      'growingStockTotal',
      'carbonStockTotal',
      'sustainableDevelopment15_1_1',
    ],
  });

  const handleAddCountry = (iso: string) => {
    if (!selectedISOs.includes(iso)) {
      setSelectedISOs([...selectedISOs, iso]);
    }
    setAddQuery('');
    setIsSearchOpen(false);
  };

  const handleRemoveCountry = (iso: string) => {
    setSelectedISOs(selectedISOs.filter((c) => c !== iso));
  };

  // Build comparison items for bar chart
  const barItems: ComparisonBarItem[] = selectedISOs.map((iso) => {
    const c = COUNTRIES.find((item) => item.iso3 === iso);
    const sum = summaries.get(iso);

    let val: number | null = null;
    if (selectedIndicator.id === 'forest_area') {
      val = sum?.forestArea1000Ha ?? null;
    } else if (selectedIndicator.id === 'forest_proportion') {
      val = sum?.forestProportionLand ?? null;
    } else if (selectedIndicator.id === 'primary_forest') {
      val = sum?.primaryForest1000Ha ?? null;
    } else if (selectedIndicator.id === 'planted_forest') {
      val = sum?.plantedForest1000Ha ?? null;
    } else if (selectedIndicator.id === 'protected_forest') {
      val = sum?.protectedForest1000Ha ?? null;
    } else if (selectedIndicator.id === 'carbon_above_ground') {
      val = sum?.carbonTotalMt ?? null;
    } else if (selectedIndicator.id === 'growing_stock_forest') {
      val = sum?.growingStockMm3 ?? null;
    } else {
      const obs = observations.find(
        (o) => o.countryIso3 === iso && o.indicatorId === selectedIndicator.id && (o.year === 2025 || o.year === '2020-2025')
      );
      val = obs ? obs.value : null;
    }

    return {
      countryIso3: iso,
      countryName: c ? (locale === 'fr' ? c.nameFr : c.nameEn) : iso,
      value: val,
    };
  });

  const filteredToAdd = COUNTRIES.filter(
    (c) =>
      !selectedISOs.includes(c.iso3) &&
      (c.nameFr.toLowerCase().includes(addQuery.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(addQuery.toLowerCase()) ||
        c.iso3.toLowerCase().includes(addQuery.toLowerCase()))
  ).slice(0, 8);

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
          {t.compareTitle}
        </h1>
        <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
          {t.compareSubtitle}
        </p>
      </div>

      {/* Country Selection Chips */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Pays sélectionnés ({selectedISOs.length})
          </span>
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addCountry}</span>
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl z-30 p-2 space-y-1">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={addQuery}
                  onChange={(e) => setAddQuery(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-stone-100 dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:outline-none mb-1"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredToAdd.map((c) => (
                    <button
                      key={c.iso3}
                      onClick={() => handleAddCountry(c.iso3)}
                      className="w-full px-2.5 py-1.5 text-left text-xs hover:bg-emerald-50 dark:hover:bg-stone-800 flex items-center justify-between rounded group"
                    >
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {locale === 'fr' ? c.nameFr : c.nameEn}
                      </span>
                      <span className="font-mono text-[10px] text-stone-400">{c.iso3}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected chips */}
        <div className="flex flex-wrap gap-2">
          {selectedISOs.map((iso) => {
            const country = COUNTRIES.find((c) => c.iso3 === iso);
            return (
              <span
                key={iso}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 text-xs font-medium text-stone-800 dark:text-stone-200"
              >
                <span
                  onClick={() => onSelectCountry(iso)}
                  className="cursor-pointer hover:underline"
                >
                  {country ? (locale === 'fr' ? country.nameFr : country.nameEn) : iso}
                </span>
                <span className="font-mono text-[10px] text-stone-400">({iso})</span>
                {selectedISOs.length > 1 && (
                  <button
                    onClick={() => handleRemoveCountry(iso)}
                    className="p-0.5 text-stone-400 hover:text-red-500 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Indicator Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-500 font-medium">Variable comparée :</span>
        <select
          value={selectedIndicatorId}
          onChange={(e) => setSelectedIndicatorId(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-medium text-stone-800 dark:text-stone-100 shadow-2xs focus:outline-none"
        >
          {INDICATORS.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {locale === 'fr' ? ind.nameFr : ind.nameEn} ({ind.unit})
            </option>
          ))}
        </select>
      </div>

      {/* Comparison Chart */}
      <ComparisonBarChart
        title={locale === 'fr' ? selectedIndicator.nameFr : selectedIndicator.nameEn}
        unit={selectedIndicator.unit}
        items={barItems}
        year={2025}
      />

      {/* Side-by-Side Detailed Matrix Table */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white">
            Tableau comparatif détaillé (FRA 2025)
          </h3>
          <span className="text-xs text-stone-400 font-mono">Données normalisées</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 font-mono text-[11px] uppercase border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Indicateur officiel</th>
                <th className="py-3 px-4 font-semibold">Unité</th>
                {selectedISOs.map((iso) => {
                  const c = COUNTRIES.find((x) => x.iso3 === iso);
                  return (
                    <th key={iso} className="py-3 px-4 font-semibold">
                      <span className="block">{c ? (locale === 'fr' ? c.nameFr : c.nameEn) : iso}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({iso})</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
              {/* Row 1: Surface forestière */}
              <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                  Superficie forestière (2025)
                </td>
                <td className="py-3 px-4 font-mono text-stone-500">1 000 ha</td>
                {selectedISOs.map((iso) => {
                  const sum = summaries.get(iso);
                  return (
                    <td key={iso} className="py-3 px-4 font-mono font-medium text-stone-900 dark:text-white">
                      {sum?.forestArea1000Ha !== null && sum?.forestArea1000Ha !== undefined
                        ? formatMetricValue(sum.forestArea1000Ha, undefined, locale)
                        : <span className="italic text-stone-400 font-sans">Non communiqué</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Part du territoire */}
              <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                  Part du territoire (ODD 15.1.1)
                </td>
                <td className="py-3 px-4 font-mono text-stone-500">%</td>
                {selectedISOs.map((iso) => {
                  const sum = summaries.get(iso);
                  return (
                    <td key={iso} className="py-3 px-4 font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      {sum?.forestProportionLand !== null && sum?.forestProportionLand !== undefined
                        ? `${sum.forestProportionLand.toFixed(1)}%`
                        : <span className="italic text-stone-400 font-sans">Non communiqué</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Forêt primaire */}
              <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                  Forêt primaire (2025)
                </td>
                <td className="py-3 px-4 font-mono text-stone-500">1 000 ha</td>
                {selectedISOs.map((iso) => {
                  const sum = summaries.get(iso);
                  return (
                    <td key={iso} className="py-3 px-4 font-mono text-stone-800 dark:text-stone-200">
                      {sum?.primaryForest1000Ha !== null && sum?.primaryForest1000Ha !== undefined
                        ? formatMetricValue(sum.primaryForest1000Ha, undefined, locale)
                        : <span className="italic text-stone-400 font-sans">Non communiqué</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Forêt protégée */}
              <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                  Forêt en aire protégée
                </td>
                <td className="py-3 px-4 font-mono text-stone-500">1 000 ha</td>
                {selectedISOs.map((iso) => {
                  const sum = summaries.get(iso);
                  return (
                    <td key={iso} className="py-3 px-4 font-mono text-stone-800 dark:text-stone-200">
                      {sum?.protectedForest1000Ha !== null && sum?.protectedForest1000Ha !== undefined
                        ? formatMetricValue(sum.protectedForest1000Ha, undefined, locale)
                        : <span className="italic text-stone-400 font-sans">Non communiqué</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Carbone */}
              <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                  Carbone forestier total
                </td>
                <td className="py-3 px-4 font-mono text-stone-500">Mt C</td>
                {selectedISOs.map((iso) => {
                  const sum = summaries.get(iso);
                  return (
                    <td key={iso} className="py-3 px-4 font-mono text-stone-800 dark:text-stone-200">
                      {sum?.carbonTotalMt !== null && sum?.carbonTotalMt !== undefined
                        ? formatMetricValue(sum.carbonTotalMt, undefined, locale)
                        : <span className="italic text-stone-400 font-sans">Non communiqué</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: Évolution relative 1990-2025 */}
              <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                  Évolution relative (1990 → 2025) *
                </td>
                <td className="py-3 px-4 font-mono text-stone-500">%</td>
                {selectedISOs.map((iso) => {
                  const sum = summaries.get(iso);
                  return (
                    <td key={iso} className="py-3 px-4 font-mono font-bold">
                      {sum?.changeSince1990Pct !== null && sum?.changeSince1990Pct !== undefined ? (
                        <span
                          className={
                            sum.changeSince1990Pct > 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : sum.changeSince1990Pct < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-stone-600'
                          }
                        >
                          {sum.changeSince1990Pct > 0 ? '+' : ''}
                          {sum.changeSince1990Pct}%
                        </span>
                      ) : (
                        <span className="italic text-stone-400 font-sans font-normal">Non calculable</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 font-mono">
          * Les lignes marquées sont des calculs dérivés transparents Forestor et non des agrégats natifs de l'API.
        </div>
      </div>

      <DataSource table="extentOfForest, carbonStockTotal, forestCharacteristics" updatedAt={updatedAt} onNavigateAbout={onNavigateAbout} />
    </div>
  );
};
