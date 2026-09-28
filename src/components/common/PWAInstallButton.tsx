import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useI18n } from '../../i18n/I18nContext';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useI18n();

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label={t.installApp}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 transition"
          aria-label={t.installIOS}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.installIOS}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-800">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-base font-semibold text-stone-900">{t.installIOS}</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-stone-600 whitespace-pre-line">
                {t.installIOSDesc}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-lg bg-emerald-700 py-2 text-xs font-medium text-white hover:bg-emerald-800 transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
