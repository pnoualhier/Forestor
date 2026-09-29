import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import {
  HelpCircle,
  X,
  BookOpen,
  Search,
  Database,
  Keyboard,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ContextualHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const ContextualHelpModal: React.FC<ContextualHelpModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'general',
}) => {
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'concepts' | 'quality' | 'shortcuts'>(
    initialTopic === 'quality' ? 'quality' : 'concepts'
  );
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const concepts = [
    {
      termFr: 'Forêt (Définition FAO)',
      termEn: 'Forest (FAO Definition)',
      defFr:
        'Terres occupant une superficie de plus de 0,5 hectare avec des arbres d’une hauteur supérieure à 5 mètres et un couvert forestier de plus de 10 %, ou des arbres capables d’atteindre ces seuils in situ. Exclut les terres à vocation agricole ou urbaine prédominante.',
      defEn:
        'Land spanning more than 0.5 hectares with trees higher than 5 meters and a canopy cover of more than 10 percent, or trees able to reach these thresholds in situ. Excludes land predominantly under agricultural or urban land use.',
    },
    {
      termFr: 'Forêt primaire',
      termEn: 'Primary forest',
      defFr:
        'Forêt de régénération naturelle composée d’espèces indigènes, où aucun signe visible d’activité humaine passée ou présente n’est clairement perceptible et où les processus écologiques ne sont pas perturbés de manière significative.',
      defEn:
        'Naturally regenerated forest of native tree species, where there are no clearly visible indications of human activities and the ecological processes are not significantly disturbed.',
    },
    {
      termFr: 'Autres terres boisées (OWL)',
      termEn: 'Other Wooded Land (OWL)',
      defFr:
        'Terres d’une superficie supérieure à 0,5 hectare avec un couvert de cimes de 5 à 10 % d’arbres capables d’atteindre une hauteur de 5 mètres, ou un couvert combiné d’arbustes, buissons et arbres supérieur à 10 %.',
      defEn:
        'Land not classified as "Forest", spanning more than 0.5 hectares; with a canopy cover of 5–10 percent of trees able to reach a height of 5 meters, or a combined cover of shrubs, bushes and trees above 10 percent.',
    },
    {
      termFr: 'Stock de Carbone & Biomasse',
      termEn: 'Carbon Stock & Biomass',
      defFr:
        'Total de carbone stocké dans 5 réservoirs clés : biomasse aérienne (tronc, branches, feuillage), biomasse souterraine (racines vivantes), bois mort, litière et matière organique du sol jusqu’à 30 cm de profondeur.',
      defEn:
        'Total carbon sequestered across 5 core pools: above-ground biomass, below-ground biomass (living roots), dead wood, litter, and soil organic matter down to 30 cm depth.',
    },
    {
      termFr: 'Densité de carbone (t/ha)',
      termEn: 'Carbon Density (t/ha)',
      defFr:
        'Quantité moyenne de carbone stockée par hectare de forêt (en tonnes par hectare). Cet indicateur mesure l’intensité carbone des écosystèmes forestiers locaux.',
      defEn:
        'Average mass of carbon stored per hectare of forest (tonnes per hectare), reflecting the carbon intensity of local forest ecosystems.',
    },
  ];

  const filteredConcepts = concepts.filter((c) => {
    const term = locale === 'fr' ? c.termFr : c.termEn;
    const def = locale === 'fr' ? c.defFr : c.defEn;
    const q = searchTerm.toLowerCase();
    return term.toLowerCase().includes(q) || def.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white leading-tight">
                {locale === 'fr' ? 'Centre d’Aide & Glossaire FAO' : 'Help Center & FAO Glossary'}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {locale === 'fr' ? 'Définitions officielles et guide d’interprétation' : 'Official definitions & interpretation guide'}
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

        {/* Tab navigation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 gap-2 bg-white dark:bg-stone-900 text-xs">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'concepts'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Définitions & Indicateurs' : 'Definitions & Indicators'}</span>
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quality'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Rigueur & Données Manquantes' : 'Data Quality & Missing Data'}</span>
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-3 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Raccourcis Clavier' : 'Shortcuts'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'concepts' && (
            <div className="space-y-4">
              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    locale === 'fr'
                      ? 'Rechercher une définition (forêt, carbone, biomasse...)'
                      : 'Search a definition (forest, carbon, biomass...)'
                  }
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-3">
                {filteredConcepts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-1.5"
                  >
                    <div className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                      {locale === 'fr' ? item.termFr : item.termEn}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {locale === 'fr' ? item.defFr : item.defEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>{locale === 'fr' ? 'Principe fondamental : null ≠ 0' : 'Core Rule: null ≠ 0'}</span>
                </div>
                <p>
                  {locale === 'fr'
                    ? "Dans Forestor, lorsqu'un pays ne déclare pas une variable (par exemple, la France ou le Royaume-Uni pour la forêt primaire), la valeur n'est JAMAIS convertie à 0. Elle est marquée comme « Non renseigné » avec un motif hachuré spécifique."
                    : 'In Forestor, when a nation does not submit data for an indicator (such as France or the UK for primary forest), the value is NEVER converted to zero. It is explicitly displayed as "Not reported" with distinct stripe shading.'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40">
                  <div className="font-semibold text-stone-900 dark:text-white flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{locale === 'fr' ? 'Rapports Nationaux Originaux' : 'Official National Reports'}</span>
                  </div>
                  <p>
                    {locale === 'fr'
                      ? 'Les chiffres sont collectés auprès des correspondants nationaux mandatés par chaque État membre de la FAO selon un protocole harmonisé (FRA 2025).'
                      : 'Data is gathered directly from national correspondents appointed by FAO member states under harmonized guidelines (FRA 2025).'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40">
                  <div className="font-semibold text-stone-900 dark:text-white flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{locale === 'fr' ? 'Audit et Traçabilité' : 'Auditability & Traceability'}</span>
                  </div>
                  <p>
                    {locale === 'fr'
                      ? 'Consultez à tout moment la section "Sources & Méthodologie" pour inspecter les métadonnées officielles de chaque pays.'
                      : 'Access the "Sources & Methodology" section at any time to verify raw country documentation and official metadata.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-300">
                    {locale === 'fr' ? 'Ouvrir la recherche globale' : 'Open quick search'}
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200 shadow-xs">
                    /
                  </kbd>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-300">
                    {locale === 'fr' ? 'Fermer les modales ou menus' : 'Close modal or drawer'}
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200 shadow-xs">
                    Esc
                  </kbd>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-300">
                    {locale === 'fr' ? 'Ouvrir ce centre d’aide' : 'Open this help center'}
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200 shadow-xs">
                    ?
                  </kbd>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-300">
                    {locale === 'fr' ? 'Zoomer sur la carte mondiale' : 'Zoom world map'}
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">
                    Molette / Touchpad
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
          >
            {locale === 'fr' ? 'Compris' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
