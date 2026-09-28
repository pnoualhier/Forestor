import React, { useState, useMemo, useEffect, useRef } from 'react';
import { COUNTRIES, Country } from '../../data/countries';
import { INDICATORS } from '../../data/indicators';
import { useI18n } from '../../i18n/I18nContext';
import { Search, Globe, Layers, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectCountry: (iso3: string) => void;
  onSelectIndicator?: (indicatorId: string) => void;
  inline?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen = true,
  onClose,
  onSelectCountry,
  onSelectIndicator,
  inline = false,
}) => {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES.slice(0, 8); // show some defaults

    return COUNTRIES.filter(
      (c) =>
        c.iso3.toLowerCase().includes(q) ||
        c.nameFr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [query]);

  const filteredIndicators = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !onSelectIndicator) return [];

    return INDICATORS.filter(
      (ind) =>
        ind.nameFr.toLowerCase().includes(q) ||
        ind.nameEn.toLowerCase().includes(q) ||
        ind.id.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, onSelectIndicator]);

  const content = (
    <div className="w-full bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden text-stone-800 dark:text-stone-100">
      {/* Search Input Box */}
      <div className="flex items-center px-4 py-3 border-b border-stone-100 dark:border-stone-800 gap-3">
        <Search className="w-5 h-5 text-emerald-600 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-transparent text-sm focus:outline-none placeholder-stone-400 text-stone-900 dark:text-white"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md ml-1"
          >
            <span className="text-xs font-mono">ESC</span>
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 p-2">
        {/* Countries group */}
        <div>
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-between">
            <span>{t.navExploreCountry}</span>
            <span>{filteredCountries.length} résultat(s)</span>
          </div>
          {filteredCountries.map((country: Country) => (
            <button
              key={country.iso3}
              onClick={() => {
                onSelectCountry(country.iso3);
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs hover:bg-emerald-50 dark:hover:bg-stone-800/80 group transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {locale === 'fr' ? country.nameFr : country.nameEn}
                  </span>
                  <span className="ml-2 font-mono text-[10px] text-stone-400 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">
                    {country.iso3}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-stone-400 group-hover:text-emerald-600 flex items-center gap-1">
                <span>{country.region}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
              </span>
            </button>
          ))}
        </div>

        {/* Indicators group (if matched) */}
        {filteredIndicators.length > 0 && (
          <div className="pt-2">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
              {t.navIndicators}
            </div>
            {filteredIndicators.map((ind) => (
              <button
                key={ind.id}
                onClick={() => {
                  if (onSelectIndicator) {
                    onSelectIndicator(ind.id);
                    if (onClose) onClose();
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs hover:bg-emerald-50 dark:hover:bg-stone-800/80 group transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {locale === 'fr' ? ind.nameFr : ind.nameEn}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                  {ind.unit}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-150">
        {content}
      </div>
    </div>
  );
};
