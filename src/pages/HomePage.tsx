import React, { useMemo } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { COUNTRIES } from '../data/countries';
import { INDICATOR_CATEGORIES } from '../data/indicators';
import { WorldMap } from '../components/map/WorldMap';
import { DataSource } from '../components/common/DataSource';
import { SearchBar } from '../components/common/SearchBar';
import { useFraData } from '../hooks/useFraData';
import {
  Globe2,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Flame,
  ArrowRight,
  TreePine,
  CheckCircle,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectCountry: (iso3: string) => void;
  onSelectIndicator: (indicatorId: string) => void;
}

const FEATURED_ISOS = ['BRA', 'RUS', 'CAN', 'USA', 'CHN', 'COD', 'IDN', 'FRA'];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCountry,
  onSelectIndicator,
}) => {
  const { t, locale } = useI18n();

  // Load baseline/live data for featured countries to render map & stats
  const { summaries, loading, fromCache, updatedAt } = useFraData({
    countryISOs: FEATURED_ISOS,
    tableNames: ['extentOfForest', 'carbonStockTotal', 'sustainableDevelopment15_1_1'],
  });

  // Map values for Forest Proportion (ODD 15.1.1) or Forest Area
  const mapValues = useMemo(() => {
    const map = new Map<string, number | null>();
    summaries.forEach((sum, iso) => {
      map.set(iso, sum.forestAreaMha);
    });
    return map;
  }, [summaries]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-radial-[at_top_right] from-emerald-900 via-stone-900 to-stone-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-stone-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>FAO Global Forest Resources Assessment — FRA 2025</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            FORESTOR
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
            {t.homeHeroSubtitle}
          </p>

          {/* Quick country search input */}
          <div className="pt-2 max-w-xl">
            <SearchBar
              inline
              onSelectCountry={onSelectCountry}
              onSelectIndicator={onSelectIndicator}
            />
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <button
              onClick={() => onNavigate('map')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md transition cursor-pointer"
            >
              <Globe2 className="w-4 h-4" />
              <span>{t.ctaExploreWorld}</span>
            </button>
            <button
              onClick={() => onNavigate('compare')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium border border-stone-700 transition cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t.ctaCompare}</span>
            </button>
          </div>
        </div>

        {/* Decorative background tree geometry */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <TreePine className="w-96 h-96 text-emerald-400" />
        </div>
      </section>

      {/* Global Key Figures Section (FRA 2025 Official Totals) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              {t.worldOverviewTitle}
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Statistiques mondiales de synthèse publiées par la FAO (FRA 2025)
            </p>
          </div>
          <DataSource compact updatedAt={updatedAt} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 4.06 Bha */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-2">
            <span className="text-xs text-stone-500 font-medium">{t.worldForestArea}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                4,06
              </span>
              <span className="text-xs font-semibold text-stone-500">Milliards ha</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              Soit environ 0,52 ha de forêt pour chaque habitant de la planète.
            </p>
          </div>

          {/* Card 2: 31% */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-2">
            <span className="text-xs text-stone-500 font-medium">{t.worldForestProportion}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                31,2
              </span>
              <span className="text-xs font-semibold text-stone-500">% des terres</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              Indicateur ODD 15.1.1 de suivi des Objectifs de Développement Durable.
            </p>
          </div>

          {/* Card 3: 662 Gt C */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-2">
            <span className="text-xs text-stone-500 font-medium">{t.worldCarbonStock}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                662
              </span>
              <span className="text-xs font-semibold text-stone-500">Gt de Carbone</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              Stocké dans la biomasse aérienne, souterraine, bois mort et les sols forestiers.
            </p>
          </div>

          {/* Card 4: 18% Protected */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-2">
            <span className="text-xs text-stone-500 font-medium">{t.worldProtectedShare}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                ~18
              </span>
              <span className="text-xs font-semibold text-stone-500">% protégées</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              Plus de 726 millions d'hectares de forêts formellement sous statut d'aire protégée.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Map Teaser */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              {t.mapTitle}
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Superficie forestière (Millions d’hectares) — FRA 2025
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Ouvrir l'atlas plein écran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <WorldMap
          valuesByIso3={mapValues}
          unit="Millions ha"
          indicatorLabel="Superficie forestière"
          onSelectCountry={onSelectCountry}
          year={2025}
        />
      </section>

      {/* Featured Countries Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
          {t.quickAccessTitle}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEATURED_ISOS.map((iso) => {
            const country = COUNTRIES.find((c) => c.iso3 === iso);
            const sum = summaries.get(iso);
            if (!country) return null;

            return (
              <button
                key={iso}
                onClick={() => onSelectCountry(iso)}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-left hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-sm transition cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {locale === 'fr' ? country.nameFr : country.nameEn}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                    {iso}
                  </span>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300">
                  {sum?.forestAreaMha ? (
                    <div>
                      <strong className="font-mono text-stone-900 dark:text-white font-bold">
                        {sum.forestAreaMha}
                      </strong>{' '}
                      <span className="text-[11px] text-stone-500">Mha</span>
                    </div>
                  ) : (
                    <span className="text-stone-400 text-[11px]">Chargement...</span>
                  )}
                  {sum?.forestProportionLand && (
                    <div className="text-[11px] text-stone-500 font-mono">
                      {sum.forestProportionLand.toFixed(1)}% du territoire
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Indicator Categories Exploration */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
          {t.exploreCategoriesTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDICATOR_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('indicators')}
              className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  {locale === 'fr' ? cat.labelFr : cat.labelEn}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {locale === 'fr' ? cat.descriptionFr : cat.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Official Data Source Card */}
      <DataSource onNavigateAbout={() => onNavigate('about')} updatedAt={updatedAt} />
    </div>
  );
};
