import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { ExternalLink, ShieldCheck, TreePine } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useI18n();

  return (
    <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight">
              <TreePine className="w-5 h-5 text-emerald-400" />
              <span>FORESTOR</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              {t.appSubheader}. {t.neverHardcoded}.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[11px] border border-stone-700/60">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Données ouvertes CC BY 4.0
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-mono text-[11px]">
                FRA 2025
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-semibold text-xs tracking-wider uppercase">
              Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.navWorldMap}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.navCompare}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('indicators')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.navIndicators}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
            </ul>
          </div>

          {/* FAO Official Resources */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-semibold text-xs tracking-wider uppercase">
              Sources officielles FAO
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://fra-data.fao.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-400 transition"
                >
                  <span>Plateforme FRA 2025</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://fra-data.fao.org/api-docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-400 transition"
                >
                  <span>Documentation API FRA</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.fao.org/forest-resources-assessment/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-400 transition"
                >
                  <span>Programme FRA — FAO</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            Source primaire : <strong>Food and Agriculture Organization of the United Nations (FAO)</strong> — Global Forest Resources Assessment 2025.
          </p>
          <p>
            Forestor est une interface indépendante de visualisation et d’exploration scientifique.
          </p>
        </div>
      </div>
    </footer>
  );
};
