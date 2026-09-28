import React, { createContext, useContext, useState, useEffect } from 'react';
import { fr, Translations } from './fr';
import { en } from './en';

type Locale = 'fr' | 'en';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('forestor_lang');
      if (saved === 'fr' || saved === 'en') return saved;
      return navigator.language.startsWith('fr') ? 'fr' : 'en';
    } catch {
      return 'fr';
    }
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('forestor_lang', newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: locale === 'fr' ? fr : en,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
