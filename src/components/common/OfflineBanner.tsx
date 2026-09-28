import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useI18n } from '../../i18n/I18nContext';
import { WifiOff, Database, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  fromCache?: boolean;
  updatedAt?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  fromCache,
  updatedAt,
  onRefresh,
  isRefreshing,
}) => {
  const isOnline = useOnlineStatus();
  const { t, locale } = useI18n();

  if (isOnline && !fromCache) return null;

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      role="status"
      className="bg-stone-900 text-stone-200 text-xs px-4 py-2 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium text-amber-200">{t.offlineNotice}</span>
          </>
        ) : (
          <>
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {t.fromCacheNotice}
              {formattedDate && ` (${t.updatedAt} ${formattedDate})`}
            </span>
          </>
        )}
      </div>

      {isOnline && onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{t.refreshData}</span>
        </button>
      )}
    </div>
  );
};
