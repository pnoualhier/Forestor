import React, { useState, useEffect } from 'react';
import { COUNTRY_BY_ISO3, Country } from '../data/countries';
import { useFraData } from '../hooks/useFraData';
import { fraRepository } from '../api/fra/fraRepository';
import { useI18n } from '../i18n/I18nContext';
import { MetricBadge } from '../components/country/MetricBadge';
import { TrendLineChart, TrendDataPoint } from '../components/charts/TrendLineChart';
import { DataSource } from '../components/common/DataSource';
import {
  Trees,
  TrendingUp,
  Sprout,
  TreePine,
  ShieldCheck,
  Flame,
  Boxes,
  Users,
  AlertTriangle,
  ArrowLeft,
  FileText,
  BarChart2,
  ExternalLink,
} from 'lucide-react';

interface CountryPageProps {
  iso3: string;
  onBack: () => void;
  onCompareWith: (iso3: string) => void;
  onNavigateAbout?: () => void;
}

export const CountryPage: React.FC<CountryPageProps> = ({
  iso3,
  onBack,
  onCompareWith,
  onNavigateAbout,
}) => {
  const { t, locale } = useI18n();
  const country: Country | undefined = COUNTRY_BY_ISO3.get(iso3);

  const [activeTab, setActiveTab] = useState<'synthesis' | 'trends' | 'descriptions'>('synthesis');
  const [descriptions, setDescriptions] = useState<any>(null);
  const [descLoading, setDescLoading] = useState(false);

  // Fetch full table data for this country
  const { summaries, observations, loading, updatedAt } = useFraData({
    countryISOs: [iso3],
    tableNames: [
      'extentOfForest',
      'forestCharacteristics',
      'forestAreaChange',
      'forestAreaWithinProtectedAreas',
      'forestOwnership',
      'growingStockTotal',
      'biomassStockTotal',
      'carbonStockTotal',
      'disturbances',
      'areaAffectedByFire',
      'sustainableDevelopment15_1_1',
    ],
  });

  const summary = summaries.get(iso3);

  // Fetch descriptions when tab is opened
  useEffect(() => {
    if (activeTab === 'descriptions' && !descriptions) {
      setDescLoading(true);
      fraRepository
        .getCountryDescriptions(iso3)
        .then((res) => {
          setDescriptions(res.data[iso3] || {});
        })
        .finally(() => setDescLoading(false));
    }
  }, [activeTab, iso3, descriptions]);

  if (!country) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">
          {t.countryNotFound}
        </h2>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 text-white text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </button>
      </div>
    );
  }

  const countryName = locale === 'fr' ? country.nameFr : country.nameEn;

  // Extract time series for extent of forest
  const forestAreaTrendPoints: TrendDataPoint[] = [1990, 2000, 2010, 2015, 2020, 2025].map((year) => {
    const obs = observations.find(
      (o) => o.indicatorId === 'forest_area' && (o.year === year || Number(o.year) === year)
    );
    return {
      year,
      value: obs ? obs.value : null,
      status: obs?.status,
    };
  });

  // Extract carbon time series
  const carbonTrendPoints: TrendDataPoint[] = [1990, 2000, 2010, 2015, 2020, 2025].map((year) => {
    const obs = observations.find(
      (o) => o.indicatorId === 'carbon_above_ground' && (o.year === year || Number(o.year) === year)
    );
    return {
      year,
      value: obs ? obs.value : null,
      status: obs?.status,
    };
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top back button & breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <button
          onClick={() => onCompareWith(iso3)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-medium text-stone-700 dark:text-stone-200 hover:border-emerald-500 transition cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Comparer ce pays</span>
        </button>
      </div>

      {/* Country Header Banner */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              {countryName}
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              {country.iso3}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span>Région : <strong>{country.region}</strong></span>
            {country.subregion && (
              <>
                <span>•</span>
                <span>Sous-région : <strong>{country.subregion}</strong></span>
              </>
            )}
            <span>•</span>
            <span>Source : <strong>FAO FRA 2025</strong></span>
          </div>
        </div>

        {/* Quick Highlights KPI Pills */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-stone-100 dark:border-stone-800 pt-4 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">Couverture forestière</span>
            <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {summary?.forestProportionLand !== null && summary?.forestProportionLand !== undefined
                ? `${summary.forestProportionLand.toFixed(1)}%`
                : 'Non communiqué'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">Surface (2025)</span>
            <span className="text-xl font-bold font-mono text-stone-900 dark:text-white">
              {summary?.forestAreaMha !== null && summary?.forestAreaMha !== undefined
                ? `${summary.forestAreaMha} Mha`
                : 'Non renseigné'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-stone-200 dark:border-stone-800 gap-6 text-sm">
        <button
          onClick={() => setActiveTab('synthesis')}
          className={`pb-3 font-medium transition cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'synthesis'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Trees className="w-4 h-4" />
          <span>{t.summaryTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-3 font-medium transition cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'trends'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t.historicalTrendsTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('descriptions')}
          className={`pb-3 font-medium transition cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'descriptions'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.countryDescriptionsTab}</span>
        </button>
      </div>

      {/* Tab 1: Synthesis Grid */}
      {activeTab === 'synthesis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* A. Surface forestière */}
            <MetricBadge
              label="🌲 Superficie forestière totale"
              value={summary?.forestArea1000Ha}
              unit="1 000 ha"
              year={2025}
            />

            {/* Part du territoire */}
            <MetricBadge
              label="🌲 Part de la surface forestière"
              value={summary?.forestProportionLand}
              unit="%"
              year={2025}
            />

            {/* Évolution depuis 1990 */}
            <MetricBadge
              label="📉 Évolution superficie (1990 → 2025)"
              value={summary?.changeSince1990Pct}
              unit="%"
              isCalculated
              formula="((valeur_2025 - valeur_1990) / valeur_1990) × 100"
            />

            {/* Variation annuelle nette */}
            <MetricBadge
              label="📉 Variation annuelle nette"
              value={summary?.forestNetChangeAnnual}
              unit="1 000 ha / an"
              year="2020–2025"
            />

            {/* Forêt primaire */}
            <MetricBadge
              label="🌳 Forêt primaire"
              value={summary?.primaryForest1000Ha}
              unit="1 000 ha"
              year={2025}
            />

            {/* Forêt naturellement régénérée */}
            <MetricBadge
              label="🌱 Forêt naturellement régénérée"
              value={summary?.naturalForest1000Ha}
              unit="1 000 ha"
              year={2025}
            />

            {/* Forêt plantée */}
            <MetricBadge
              label="🌱 Forêt plantée"
              value={summary?.plantedForest1000Ha}
              unit="1 000 ha"
              year={2025}
            />

            {/* Forêt protégée */}
            <MetricBadge
              label="🏞️ Forêt en aire protégée"
              value={summary?.protectedForest1000Ha}
              unit="1 000 ha"
              year={2025}
            />

            {/* Stock de carbone */}
            <MetricBadge
              label="🪵 Stock total de carbone forestier"
              value={summary?.carbonTotalMt}
              unit="Mt C"
              year={2025}
            />

            {/* Bois sur pied */}
            <MetricBadge
              label="🪓 Volume de bois sur pied"
              value={summary?.growingStockMm3}
              unit="Million m³"
              year={2025}
            />

            {/* Propriété publique */}
            <MetricBadge
              label="👥 Propriété publique"
              value={summary?.publicOwnership1000Ha}
              unit="1 000 ha"
              year={2020}
            />

            {/* Propriété privée */}
            <MetricBadge
              label="👥 Propriété privée"
              value={summary?.privateOwnership1000Ha}
              unit="1 000 ha"
              year={2020}
            />
          </div>

          {/* Quick Trend Preview inline */}
          <div className="pt-4">
            <TrendLineChart
              title="Superficie forestière (1990–2025)"
              countryName={countryName}
              unit="1 000 ha"
              data={forestAreaTrendPoints}
              source="FAO FRA 2025 (Table extentOfForest)"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Historical Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendLineChart
              title="Superficie forestière (1990–2025)"
              countryName={countryName}
              unit="1 000 ha"
              data={forestAreaTrendPoints}
              source="FAO FRA 2025 (extentOfForest)"
            />
            <TrendLineChart
              title="Carbone dans la biomasse aérienne (1990–2025)"
              countryName={countryName}
              unit="Mt C"
              data={carbonTrendPoints}
              color="#0284c7"
              source="FAO FRA 2025 (carbonStockTotal)"
            />
          </div>
        </div>
      )}

      {/* Tab 3: National Descriptions & Sources */}
      {activeTab === 'descriptions' && (
        <div className="space-y-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-white">
                Métadonnées nationales déclarées pour {countryName}
              </h3>
              <p className="text-xs text-stone-500">
                Textes explicatifs et sources d'inventaire transmises directement par le pays à la FAO.
              </p>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600">
              FRA 2025
            </span>
          </div>

          {descLoading ? (
            <div className="py-8 text-center text-xs text-stone-400">
              Chargement des descriptions nationales...
            </div>
          ) : descriptions && Object.keys(descriptions).length > 0 ? (
            <div className="space-y-6 divide-y divide-stone-100 dark:divide-stone-800">
              {Object.entries(descriptions).map(([section, data]: [string, any]) => (
                <div key={section} className="pt-4 space-y-2">
                  <h4 className="font-mono text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                    Section : {section}
                  </h4>
                  {data?.dataSources?.text && (
                    <div
                      className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed overflow-x-auto max-w-full prose prose-xs"
                      dangerouslySetInnerHTML={{ __html: data.dataSources.text }}
                    />
                  )}
                  {data?.generalComments?.text && (
                    <div
                      className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed overflow-x-auto max-w-full prose prose-xs"
                      dangerouslySetInnerHTML={{ __html: data.generalComments.text }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-400 italic">
              Aucun commentaire narratif spécifique transmis pour ce pays via l'API de description.
            </div>
          )}
        </div>
      )}

      {/* Official Data Source Transparency */}
      <DataSource table="extentOfForest, carbonStockTotal, forestCharacteristics" updatedAt={updatedAt} onNavigateAbout={onNavigateAbout} />
    </div>
  );
};
