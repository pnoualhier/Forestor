import React, { useState, useMemo } from 'react';
import { INDICATORS, INDICATOR_CATEGORIES } from '../data/indicators';
import { IndicatorCategory, ForestIndicator } from '../types/indicator';
import { useI18n } from '../i18n/I18nContext';
import { DataSource } from '../components/common/DataSource';
import { Search, Filter, Layers, Database, ArrowRight } from 'lucide-react';

interface IndicatorsPageProps {
  onSelectIndicator: (indicatorId: string) => void;
  onNavigateAbout?: () => void;
}

export const IndicatorsPage: React.FC<IndicatorsPageProps> = ({
  onSelectIndicator,
  onNavigateAbout,
}) => {
  const { t, locale } = useI18n();
  const [selectedCat, setSelectedCat] = useState<IndicatorCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndicators = useMemo(() => {
    return INDICATORS.filter((ind) => {
      const matchCat = selectedCat === 'all' || ind.category === selectedCat;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        ind.nameFr.toLowerCase().includes(q) ||
        ind.nameEn.toLowerCase().includes(q) ||
        ind.descriptionFr.toLowerCase().includes(q) ||
        ind.descriptionEn.toLowerCase().includes(q) ||
        ind.code.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCat, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
          {t.indicatorsTitle}
        </h1>
        <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
          {t.indicatorsSubtitle}
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchIndicator}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              Tous ({INDICATORS.length})
            </button>
            {INDICATOR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {locale === 'fr' ? cat.labelFr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIndicators.map((ind: ForestIndicator) => {
          const categoryMeta = INDICATOR_CATEGORIES.find((c) => c.id === ind.category);
          return (
            <div
              key={ind.id}
              className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-semibold">
                    {categoryMeta ? (locale === 'fr' ? categoryMeta.labelFr : categoryMeta.labelEn) : ind.category}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white mt-1.5">
                    {locale === 'fr' ? ind.nameFr : ind.nameEn}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold shrink-0">
                  {ind.unit}
                </span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {locale === 'fr' ? ind.descriptionFr : ind.descriptionEn}
              </p>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 space-y-1 font-mono">
                <div>
                  <span className="text-stone-400">Table FRA :</span> <strong>{ind.tableName}</strong>
                </div>
                <div>
                  <span className="text-stone-400">Variable :</span> <strong>{ind.variableName}</strong>
                </div>
                <div>
                  <span className="text-stone-400">Années disponibles :</span>{' '}
                  <span>{ind.defaultYears.join(', ')}</span>
                </div>
              </div>

              <div className="pt-2 text-xs italic text-stone-500 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                <strong>Clé de lecture :</strong>{' '}
                {locale === 'fr' ? ind.methodologyFr : ind.methodologyEn}
              </div>
            </div>
          );
        })}
      </div>

      <DataSource onNavigateAbout={onNavigateAbout} />
    </div>
  );
};
