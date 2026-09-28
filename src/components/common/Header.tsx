import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Trees, Globe2, BarChart3, Layers, HelpCircle, Menu, X, Search } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { t, locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.appName, icon: Trees },
    { id: 'map', label: t.navWorldMap, icon: Globe2 },
    { id: 'compare', label: t.navCompare, icon: BarChart3 },
    { id: 'indicators', label: t.navIndicators, icon: Layers },
    { id: 'about', label: t.navAbout, icon: HelpCircle },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none"
            aria-label="Forestor Accueil"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:bg-emerald-500 transition">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-white block leading-none">
                FORESTOR
              </span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase block mt-1">
                FAO FRA 2025
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.id === 'home'
                  ? currentRoute === 'home'
                  : currentRoute.startsWith(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-stone-800 text-emerald-400 shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Quick Search, Language Switcher, PWA Install */}
          <div className="flex items-center gap-2">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700/80 text-stone-300 hover:text-white text-xs border border-stone-700/60 transition cursor-pointer"
                title={t.searchPlaceholder}
              >
                <Search className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline text-stone-400">{t.selectCountry}...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.2 bg-stone-900 border border-stone-700 rounded text-[10px] text-stone-400 font-mono">
                  /
                </kbd>
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center border border-stone-700/80 rounded-lg p-0.5 bg-stone-800/80 text-xs font-mono">
              <button
                onClick={() => setLocale('fr')}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  locale === 'fr'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Passer en français"
              >
                FR
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  locale === 'en'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* PWA Install */}
            <PWAInstallButton />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-stone-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.id === 'home'
                ? currentRoute === 'home'
                : currentRoute.startsWith(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${
                  isActive
                    ? 'bg-stone-800 text-emerald-400'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
