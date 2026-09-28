import React from 'react';
import { ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

interface DataSourceProps {
  updatedAt?: string | null;
  table?: string;
  variable?: string;
  compact?: boolean;
  onNavigateAbout?: () => void;
}

export const DataSource: React.FC<DataSourceProps> = ({
  updatedAt,
  table,
  variable,
  compact = false,
  onNavigateAbout,
}) => {
  const { t, locale } = useI18n();
  const dateStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '2025-2026';

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500 font-mono">
        <span className="flex items-center gap-1 text-emerald-800 font-sans font-medium">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          FAO FRA 2025
        </span>
        <span>•</span>
        <span>{dateStr}</span>
        {table && (
          <>
            <span>•</span>
            <span className="bg-stone-100 px-1 py-0.5 rounded text-stone-600 text-[10px]">{table}</span>
          </>
        )}
        <a
          href="https://fra-data.fao.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:underline inline-flex items-center gap-0.5"
          title="FAO FRA Platform"
        >
          <span>fao.org</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 text-xs text-stone-700 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-stone-900">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>{t.officialSourceLabel}</span>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
          Cycle FRA 2025
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-200/80 text-[11px]">
        <div>
          <span className="text-stone-500 font-normal">Organisation : </span>
          <strong className="text-stone-800">FAO (Nations Unies)</strong>
        </div>
        <div>
          <span className="text-stone-500 font-normal">Évaluation : </span>
          <strong className="text-stone-800">Global Forest Resources Assessment</strong>
        </div>
        <div>
          <span className="text-stone-500 font-normal">Interface API : </span>
          <span className="font-mono text-stone-700">API officielle fra-data.fao.org</span>
        </div>
        <div>
          <span className="text-stone-500 font-normal">Date de relevé : </span>
          <span className="text-stone-700">{dateStr}</span>
        </div>
      </div>

      {(table || variable) && (
        <div className="pt-2 border-t border-stone-200/60 flex items-center gap-2 font-mono text-[10px] text-stone-600">
          <span>Table : <strong className="text-stone-800">{table}</strong></span>
          {variable && <span>| Variable : <strong className="text-stone-800">{variable}</strong></span>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px]">
        <a
          href="https://fra-data.fao.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
        >
          <span>{t.faoPlatformLink}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://fra-data.fao.org/api-docs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-800 hover:underline"
        >
          <span>{t.apiDocLink}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        {onNavigateAbout && (
          <button
            onClick={onNavigateAbout}
            className="text-stone-600 hover:text-stone-900 underline ml-auto cursor-pointer"
          >
            {t.navAbout}
          </button>
        )}
      </div>
    </div>
  );
};
