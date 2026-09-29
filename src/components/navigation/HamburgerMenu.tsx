import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useTheme, ThemeMode } from '../../theme/ThemeContext';
import { Logo } from '../common/Logo';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Trees,
  Globe2,
  BarChart3,
  Layers,
  HelpCircle,
  Settings,
  Sun,
  Moon,
  Laptop,
  Compass,
  FileText,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  onOpenHelp: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  onOpenSettings,
  onOpenOnboarding,
  onOpenHelp,
}) => {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const handleNav = (route: string) => {
    onNavigate(route);
    onClose();
  };

  const categories = [
    {
      id: 'exploration',
      titleFr: 'Exploration & Analyse',
      titleEn: 'Exploration & Analysis',
      items: [
        {
          id: 'home',
          labelFr: 'Vue d’ensemble mondiale',
          labelEn: 'Global Overview',
          descFr: 'KPIs mondiaux, surfaces et faits saillants FRA 2025',
          descEn: 'Global KPIs, surface areas & FRA 2025 highlights',
          icon: Trees,
          action: () => handleNav('home'),
          isActive: currentRoute === 'home',
        },
        {
          id: 'country',
          labelFr: 'Fiche détaillée Pays',
          labelEn: 'Country Deep-Dive',
          descFr: '236 pays et territoires avec historique 1990–2025',
          descEn: '236 nations and territories with 1990–2025 history',
          icon: Compass,
          action: () => handleNav('country'),
          isActive: currentRoute.startsWith('country'),
        },
        {
          id: 'compare',
          labelFr: 'Comparateur Multi-Pays',
          labelEn: 'Multi-Country Benchmark',
          descFr: 'Analyse comparative libre sans limite de pays',
          descEn: 'Flexible benchmark analysis with unlimited countries',
          icon: BarChart3,
          action: () => handleNav('compare'),
          isActive: currentRoute.startsWith('compare'),
        },
      ],
    },
    {
      id: 'mapping',
      titleFr: 'Cartographie & Données',
      titleEn: 'Mapping & Data',
      items: [
        {
          id: 'map',
          labelFr: 'Carte Mondiale Interactive',
          labelEn: 'Interactive World Map',
          descFr: 'Visualisation vectorielle en 5 quantiles avec zoom/pan',
          descEn: 'Vector map across 5 quantiles with zoom and pan',
          icon: Globe2,
          action: () => handleNav('map'),
          isActive: currentRoute.startsWith('map'),
        },
        {
          id: 'indicators',
          labelFr: 'Catalogue des 21 Indicateurs',
          labelEn: '21 Indicators Catalog',
          descFr: 'Surfaces, biomasse, carbone, perturbations et régénération',
          descEn: 'Surfaces, biomass, carbon, disturbances, and regeneration',
          icon: Layers,
          action: () => handleNav('indicators'),
          isActive: currentRoute.startsWith('indicators'),
        },
      ],
    },
    {
      id: 'methodology',
      titleFr: 'Méthodologie & Références',
      titleEn: 'Methodology & References',
      items: [
        {
          id: 'about',
          labelFr: 'Sources officielles & Méthode FAO',
          labelEn: 'Official Sources & FAO Method',
          descFr: 'Documentation nationale, métadonnées et licences',
          descEn: 'National documentation, metadata & licensing',
          icon: FileText,
          action: () => handleNav('about'),
          isActive: currentRoute.startsWith('about'),
        },
        {
          id: 'help',
          labelFr: 'Centre d’aide & Glossaire',
          labelEn: 'Help Center & Glossary',
          descFr: 'Définitions officielles, rigueur scientifique et raccourcis',
          descEn: 'Official definitions, scientific rigor, and shortcuts',
          icon: HelpCircle,
          action: () => {
            onClose();
            onOpenHelp();
          },
          isActive: false,
        },
        {
          id: 'onboarding',
          labelFr: 'Visite guidée interactive',
          labelEn: 'Interactive Guided Tour',
          descFr: 'Redécouvrir les 4 piliers de l’application',
          descEn: 'Rediscover the 4 core pillars of the application',
          icon: Sparkles,
          action: () => {
            onClose();
            onOpenOnboarding();
          },
          isActive: false,
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pr-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Top Header */}
          <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-950/40">
            <Logo size="md" />
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categorized Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <h3 className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
                  {locale === 'fr' ? category.titleFr : category.titleEn}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition text-left cursor-pointer group ${
                          item.isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-800/60 border border-transparent'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                            item.isActive
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 group-hover:bg-emerald-600 group-hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold ${
                                item.isActive
                                  ? 'text-emerald-900 dark:text-emerald-200'
                                  : 'text-stone-900 dark:text-white'
                              }`}
                            >
                              {locale === 'fr' ? item.labelFr : item.labelEn}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition" />
                          </div>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {locale === 'fr' ? item.descFr : item.descEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Section: Paramètres Système */}
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
                {locale === 'fr' ? 'Système & Préférences' : 'System & Preferences'}
              </h3>

              {/* System settings trigger button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 dark:text-white">
                      {locale === 'fr' ? 'Paramètres Système & Mises à Jour' : 'System Settings & Updates'}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      v1.2.0 • 28 Septembre 2026
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Bottom Settings Bar: Theme & Language */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              {/* Theme Selector */}
              <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title={locale === 'fr' ? 'Thème Clair' : 'Light Theme'}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{locale === 'fr' ? 'Clair' : 'Light'}</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title={locale === 'fr' ? 'Thème Sombre' : 'Dark Theme'}
                >
                  <Moon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Sombre' : 'Dark'}</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    theme === 'system'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title={locale === 'fr' ? 'Thème Système' : 'System Theme'}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Auto</span>
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg p-0.5 bg-stone-200/50 dark:bg-stone-800 text-xs font-mono">
                <button
                  onClick={() => setLocale('fr')}
                  className={`px-2 py-0.5 rounded text-[11px] transition ${
                    locale === 'fr'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={`px-2 py-0.5 rounded text-[11px] transition ${
                    locale === 'en'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
              <span>FORESTOR • FAO FRA 2025</span>
              <PWAInstallButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
