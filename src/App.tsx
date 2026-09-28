import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { SearchBar } from './components/common/SearchBar';
import { HomePage } from './pages/HomePage';
import { CountryPage } from './pages/CountryPage';
import { ComparePage } from './pages/ComparePage';
import { MapPage } from './pages/MapPage';
import { IndicatorsPage } from './pages/IndicatorsPage';
import { AboutSourcesPage } from './pages/AboutSourcesPage';
import { fraRepository } from './api/fra/fraRepository';

function MainApp() {
  const { t } = useI18n();

  // Navigation route management with URL hash support
  const [route, setRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  });

  const [selectedCountryIso, setSelectedCountryIso] = useState<string>('FRA');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Keyboard shortcut '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    fraRepository.clearCache();
    // Quick reload
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors">
      <OfflineBanner onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <Header
        currentRoute={route}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
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
            onCompareWith={(iso) => {
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
    <I18nProvider>
      <MainApp />
    </I18nProvider>
  );
}
