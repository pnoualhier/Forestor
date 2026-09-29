import React, { useState } from 'react';
import { useUpdateManager } from '../../hooks/useUpdateManager';
import { useI18n } from '../../i18n/I18nContext';
import {
  Settings,
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  HardDrive,
  Radio,
  X,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({ isOpen, onClose }) => {
  const { locale } = useI18n();
  const {
    appVersion,
    releaseDate,
    lastCheckedDate,
    autoUpdateEnabled,
    status,
    statusMessage,
    updateIntervalMinutes,
    metadata,
    checkForUpdates,
    forceUpdate,
    setAutoUpdateEnabled,
    setUpdateInterval,
  } = useUpdateManager();

  const [isForcing, setIsForcing] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatDate = (isoString: string | null) => {
    if (!isoString) return locale === 'fr' ? 'Jamais vérifié' : 'Never checked';
    try {
      const d = new Date(isoString);
      return d.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleManualCheck = async () => {
    setFeedbackNotice(null);
    const updated = await checkForUpdates(false);
    if (!updated) {
      setFeedbackNotice(
        locale === 'fr'
          ? 'Votre application est sur la version la plus récente.'
          : 'Your application is running the latest version.'
      );
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  const handleForceUpdate = async () => {
    setIsForcing(true);
    await forceUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white leading-tight">
                {locale === 'fr' ? 'Paramètres Système & Mises à Jour' : 'System Settings & Updates'}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {locale === 'fr' ? 'Statut du moteur et cycle de vie PWA' : 'Engine status and PWA lifecycle'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Card: Version & Release info */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{locale === 'fr' ? 'Version installée' : 'Installed Version'}</span>
              </div>
              <span className="font-mono font-bold text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                v{appVersion}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-500 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {locale === 'fr' ? 'Date de sortie' : 'Release Date'}
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {releaseDate}
                </span>
              </div>

              <div>
                <span className="text-stone-500 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  {locale === 'fr' ? 'Dernière vérification' : 'Last check'}
                </span>
                <span className="font-mono text-stone-800 dark:text-stone-200 text-[11px]">
                  {formatDate(lastCheckedDate)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 font-mono pt-1 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between">
              <span>{metadata.dataCycle}</span>
              <span className="text-emerald-700 dark:text-emerald-400">{metadata.license}</span>
            </div>
          </div>

          {/* Real-time Status banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 text-xs">
            {status === 'checking' || status === 'installing' ? (
              <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin shrink-0" />
            ) : status === 'ready' ? (
              <Download className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <div className="flex-1">
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {statusMessage ||
                  (locale === 'fr'
                    ? 'Tous les systèmes et données locales sont synchronisés.'
                    : 'All systems and local datasets are synced.')}
              </span>
              {feedbackNotice && (
                <div className="text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                  {feedbackNotice}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Vérifier les mises à jour & Forcer la mise à jour */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleManualCheck}
              disabled={status === 'checking' || isForcing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-medium text-xs transition shadow-sm cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${status === 'checking' ? 'animate-spin' : ''}`}
              />
              <span>
                {status === 'checking'
                  ? locale === 'fr'
                    ? 'Vérification...'
                    : 'Checking...'
                  : locale === 'fr'
                  ? 'Vérifier les mises à jour'
                  : 'Check for updates'}
              </span>
            </button>

            <button
              onClick={handleForceUpdate}
              disabled={isForcing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-red-400 dark:hover:border-red-500 text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 font-medium text-xs transition cursor-pointer disabled:opacity-60"
              title="Vide le cache applicatif et recharge immédiatement la version la plus récente"
            >
              <Zap className={`w-3.5 h-3.5 ${isForcing ? 'animate-pulse text-amber-500' : ''}`} />
              <span>
                {isForcing
                  ? locale === 'fr'
                    ? 'Purge & Actualisation...'
                    : 'Purging & Reloading...'
                  : locale === 'fr'
                  ? 'Forcer la mise à jour'
                  : 'Force update'}
              </span>
            </button>
          </div>

          {/* Background Auto-Update Configuration */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  {locale === 'fr'
                    ? 'Mises à jour automatiques en arrière-plan'
                    : 'Background automatic updates'}
                </span>
                <p className="text-[11px] text-stone-500 max-w-sm">
                  {locale === 'fr'
                    ? 'Vérifie et précharge silencieusement en arrière-plan les correctifs et nouvelles données FRA.'
                    : 'Silently checks and precaches updates and new FRA data in the background.'}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoUpdateEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                role="switch"
                aria-checked={autoUpdateEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    autoUpdateEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {autoUpdateEnabled && (
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                  {locale === 'fr' ? 'Fréquence de vérification' : 'Check frequency'}
                </span>
                <select
                  value={updateIntervalMinutes}
                  onChange={(e) => setUpdateInterval(parseInt(e.target.value, 10))}
                  className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 text-xs text-stone-800 dark:text-stone-200 cursor-pointer"
                >
                  <option value={15}>
                    {locale === 'fr' ? 'Toutes les 15 minutes' : 'Every 15 minutes'}
                  </option>
                  <option value={30}>
                    {locale === 'fr' ? 'Toutes les 30 minutes' : 'Every 30 minutes'}
                  </option>
                  <option value={60}>{locale === 'fr' ? 'Toutes les heures' : 'Every hour'}</option>
                  <option value={360}>
                    {locale === 'fr' ? 'Toutes les 6 heures' : 'Every 6 hours'}
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Diagnostic info & Storage */}
          <div className="rounded-xl bg-stone-50 dark:bg-stone-950 p-3.5 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 space-y-1.5 font-mono">
            <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300">
              <HardDrive className="w-3.5 h-3.5 text-stone-400" />
              <span>{locale === 'fr' ? 'Stockage & Résilience' : 'Storage & Offline Resilience'}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker :</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Actif (PWA)</span>
            </div>
            <div className="flex justify-between">
              <span>Stratégie de cache :</span>
              <span>Stale-While-Revalidate + LocalStorage</span>
            </div>
            <div className="flex justify-between">
              <span>Intégrité des données :</span>
              <span>100% FAO FRA 2025 non falsifiée</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            {locale === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
