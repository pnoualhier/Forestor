import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { ThemeProvider } from './theme/ThemeContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { SearchBar } from './components/common/SearchBar';
import { HamburgerMenu } from './components/navigation/HamburgerMenu';
import { SystemSettingsModal } from './components/settings/SystemSettingsModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ContextualHelpModal } from './components/help/ContextualHelpModal';
import { HomePage } from './pages/HomePage';
import { CountryPage } from './pages/CountryPage';
import { ComparePage } from './pages/ComparePage';
import { MapPage } from './pages/MapPage';
import { IndicatorsPage } from './pages/IndicatorsPage';
import { AboutSourcesPage } from './pages/AboutSourcesPage';
import { fraRepository } from './api/fra/fraRepository';
import { useUpdateManager } from './hooks/useUpdateManager';
import { Sparkles, RefreshCw } from 'lucide-react';

function MainApp() {
  const { t, locale } = useI18n();
  const { status, forceUpdate } = useUpdateManager();

  // Navigation route management with URL hash support
  const [route, setRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  });

  const [selectedCountryIso, setSelectedCountryIso] = useState<string>('FRA');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('forestor-onboarding-done') !== 'true';
    } catch {
      return false;
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync route with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('country/')) {
        const iso = hash.split('/')[1]?.toUpperCase();
        if (iso) {
          setSelectedCountryIso(iso);
          setRoute('country');
          return;
        }
      }
      setRoute(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    window.location.hash = `#/${newRoute}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountry = (iso3: string) => {
    setSelectedCountryIso(iso3);
    setRoute('country');
    window.location.hash = `#/country/${iso3}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectIndicator = (indicatorId: string) => {
    setRoute('indicators');
    window.location.hash = `#/indicators`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard shortcuts: '/' (search), '?' (help), 'Escape' (close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsHamburgerOpen(false);
        setIsSettingsOpen(false);
        setIsHelpOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    fraRepository.clearCache();
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors selection:bg-emerald-200 selection:text-emerald-950">
      <OfflineBanner onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Floating Auto-Update Notice when update ready */}
      {status === 'ready' && (
        <aside
          aria-label="Notification de mise à jour"
          className="sticky top-16 z-30 bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span className="font-medium">
              {locale === 'fr'
                ? 'Une nouvelle version a été installée avec succès en arrière-plan.'
                : 'A new release was silently installed in the background.'}
            </span>
          </div>
          <button
            onClick={() => forceUpdate()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{locale === 'fr' ? 'Recharger' : 'Reload'}</span>
          </button>
        </aside>
      )}

      <Header
        currentRoute={route}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenHamburger={() => setIsHamburgerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {route === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectCountry={handleSelectCountry}
            onSelectIndicator={handleSelectIndicator}
          />
        )}

        {route === 'country' && (
          <CountryPage
            iso3={selectedCountryIso}
            onBack={() => navigateTo('home')}
            onCompareWith={() => {
              navigateTo('compare');
            }}
            onNavigateAbout={() => navigateTo('about')}
          />
        )}

        {route === 'compare' && (
          <ComparePage
            initialCountries={[selectedCountryIso, 'DEU', 'BRA', 'CAN']}
            onSelectCountry={handleSelectCountry}
            onNavigateAbout={() => navigateTo('about')}
          />
        )}

        {route === 'map' && (
          <MapPage
            onSelectCountry={handleSelectCountry}
            onNavigateAbout={() => navigateTo('about')}
          />
        )}

        {route === 'indicators' && (
          <IndicatorsPage
            onSelectIndicator={handleSelectIndicator}
            onNavigateAbout={() => navigateTo('about')}
          />
        )}

        {route === 'about' && <AboutSourcesPage />}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Hamburger Navigation Drawer */}
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        currentRoute={route}
        onNavigate={navigateTo}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* System Settings & Update Lifecycle Modal */}
      <SystemSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Contextual Help & FAO Glossary Modal */}
      <ContextualHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Interactive Onboarding Walkthrough Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenMap={() => navigateTo('map')}
      />

      {/* Quick Search Modal */}
      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCountry={handleSelectCountry}
        onSelectIndicator={handleSelectIndicator}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <MainApp />
      </I18nProvider>
    </ThemeProvider>
  );
}
