import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useTheme } from '../../theme/ThemeContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Menu,
  Search,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Trees,
  Globe2,
  BarChart3,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch?: () => void;
  onOpenHamburger: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  onOpenHamburger,
  onOpenSettings,
  onOpenHelp,
}) => {
  const { t, locale, setLocale } = useI18n();
  const { theme, actualTheme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: t.appName, icon: Trees },
    { id: 'map', label: t.navWorldMap, icon: Globe2 },
    { id: 'compare', label: t.navCompare, icon: BarChart3 },
    { id: 'indicators', label: t.navIndicators, icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Hamburger menu toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenHamburger}
              className="p-2 -ml-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              aria-label="Menu principal par catégorie"
              title="Menu des fonctionnalités par catégorie"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
              aria-label="Forestor Accueil"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* Center: Desktop Navigation Quick Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.id === 'home'
                  ? currentRoute === 'home'
                  : currentRoute.startsWith(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Theme Toggle, Help, Settings, Lang */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search trigger */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 text-stone-600 dark:text-stone-300 text-xs border border-stone-200/80 dark:border-stone-700/60 transition cursor-pointer"
                title={t.searchPlaceholder}
              >
                <Search className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline text-stone-500 dark:text-stone-400 text-xs">
                  {t.selectCountry}...
                </span>
                <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-[10px] text-stone-400 font-mono shadow-2xs">
                  /
                </kbd>
              </button>
            )}

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title={actualTheme === 'dark' ? 'Activer le mode Clair' : 'Activer le mode Sombre'}
              aria-label="Basculer le thème clair / sombre"
            >
              {actualTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Contextual Help trigger */}
            <button
              onClick={onOpenHelp}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Centre d'aide et glossaire FAO (?)"
              aria-label="Aide contextuelle et définitions"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* System Settings trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Paramètres système et mises à jour"
              aria-label="Paramètres système"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-mono">
              <button
                onClick={() => setLocale('fr')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition cursor-pointer ${
                  locale === 'fr'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Passer en français"
              >
                FR
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition cursor-pointer ${
                  locale === 'en'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* PWA Install */}
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
