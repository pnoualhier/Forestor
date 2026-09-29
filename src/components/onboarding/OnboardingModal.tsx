import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Logo } from '../common/Logo';
import {
  Globe2,
  BarChart3,
  Layers,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Sparkles,
  CloudCheck,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMap?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onOpenMap,
}) => {
  const { locale } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      titleFr: 'Bienvenue sur Forestor',
      titleEn: 'Welcome to Forestor',
      subtitleFr: 'Observatoire mondial des ressources forestières (FAO FRA 2025)',
      subtitleEn: 'Global Forest Resources Assessment Observatory (FAO FRA 2025)',
      icon: Logo,
      contentFr: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Forestor est votre outil d'exploration scientifique et d'analyse des données de la{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">FAO (FRA 2025)</strong>,
            couvrant <span className="font-semibold text-stone-900 dark:text-white">236 pays et territoires</span> sur la période 1990–2025.
          </p>
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200">
            🌱 <strong>Zéro statistique inventée</strong> : chaque donnée affichée provient directement des déclarations nationales officielles et des rapports harmonisés de la FAO.
          </div>
        </div>
      ),
      contentEn: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Forestor is your scientific observatory for exploring the official{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">FAO (FRA 2025)</strong> dataset,
            covering <span className="font-semibold text-stone-900 dark:text-white">236 countries and territories</span> from 1990 to 2025.
          </p>
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200">
            🌱 <strong>Zero fabricated statistics</strong>: every metric shown stems directly from official national reports and harmonized FAO data.
          </div>
        </div>
      ),
    },
    {
      titleFr: 'Cartographie Mondiale Vectorielle',
      titleEn: 'Interactive Global Vector Map',
      subtitleFr: 'Visualisez les distributions géographiques en 5 quantiles',
      subtitleEn: 'Visualize geographic distributions across 5 quantiles',
      icon: Globe2,
      contentFr: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Explorez les surfaces forestières, le taux de couverture et les stocks de carbone sur une carte du monde fluide et interactive :
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li><strong>Zoom et déplacement</strong> à la souris ou au pavé tactile.</li>
            <li><strong>Survol instantané</strong> pour inspecter la valeur exacte d'un pays.</li>
            <li><strong>Clic direct</strong> pour ouvrir la fiche analytique complète du pays sélectionné.</li>
          </ul>
        </div>
      ),
      contentEn: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Explore forest area, proportion of land area, and carbon stocks on a smooth, interactive world map:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li><strong>Pan & Zoom</strong> seamlessly with mouse, trackpad, or touch.</li>
            <li><strong>Hover tooltip</strong> to inspect exact metrics for any country.</li>
            <li><strong>Single-click navigation</strong> to open full country analytical profiles.</li>
          </ul>
        </div>
      ),
    },
    {
      titleFr: '21 Indicateurs & Comparateur Multi-Pays',
      titleEn: '21 Indicators & Multi-Country Comparison',
      subtitleFr: 'Courbes temporelles, forêts primaires et stocks de carbone',
      subtitleEn: 'Historical time series, primary forests, and carbon biomass',
      icon: BarChart3,
      contentFr: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Analysez en profondeur l'évolution des forêts avec notre comparateur sans limite de pays :
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>Comparaison côte à côte des surfaces, stocks de carbone et taux de protection.</li>
            <li>Identification claire des <em>données non communiquées</em> avec des hachures distinctives pour éviter toute fausse interprétation.</li>
            <li>Convertisseur d'unités automatique (hectares, km², millions d'hectares).</li>
          </ul>
        </div>
      ),
      contentEn: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Perform in-depth temporal analyses with our flexible multi-country comparison suite:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>Side-by-side benchmarking of forest area, carbon density, and protected status.</li>
            <li>Clear visual distinction for <em>unreported data</em> using clean striped hatches.</li>
            <li>Integrated unit formatting (hectares, square kilometers, megahectares).</li>
          </ul>
        </div>
      ),
    },
    {
      titleFr: 'Mises à Jour Automatiques & Mode Hors-Ligne',
      titleEn: 'Background Auto-Updates & Offline Mode',
      subtitleFr: 'PWA résiliente avec synchronisation silencieuse',
      subtitleEn: 'Resilient PWA with silent background sync',
      icon: CloudCheck,
      contentFr: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Forestor est conçu pour fonctionner partout, même sans connexion Internet :
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li><strong>Mises à jour automatiques en arrière-plan</strong> : le système vérifie régulièrement la disponibilité de nouvelles versions et les installe en tâche de fond.</li>
            <li><strong>Menu Hamburger catégorisé</strong> : retrouvez l'ensemble des modules d'exploration, de cartographie et de paramètres système en un clic.</li>
            <li><strong>Thèmes Clair / Sombre</strong> au choix pour un confort de lecture optimal.</li>
          </ul>
        </div>
      ),
      contentEn: (
        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
          <p>
            Forestor is engineered to work reliably anywhere, even without an active internet connection:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li><strong>Background Auto-Updates</strong>: the engine periodically checks and installs releases silently.</li>
            <li><strong>Categorized Hamburger Menu</strong>: effortlessly access exploration, mapping, and system tools in one place.</li>
            <li><strong>Light / Dark Themes</strong> with instant toggle for optimal reading comfort.</li>
          </ul>
        </div>
      ),
    },
  ];

  const handleFinish = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('forestor-onboarding-done', 'true');
      } catch {
        // ignore
      }
    }
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const stepData = steps[currentStep];
  const StepIcon = stepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Dismiss Button */}
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          aria-label="Fermer la visite guidée"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Graphic */}
        <div className="p-6 pb-4 pt-8 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-emerald-950/10 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              {currentStep === 0 ? (
                <Logo size="md" showText={false} />
              ) : (
                <StepIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {locale === 'fr' ? `Étape ${currentStep + 1} sur ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}
              </span>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white leading-snug">
                {locale === 'fr' ? stepData.titleFr : stepData.titleEn}
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {locale === 'fr' ? stepData.subtitleFr : stepData.subtitleEn}
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4 min-h-[190px]">
          {locale === 'fr' ? stepData.contentFr : stepData.contentEn}
        </div>

        {/* Footer & Controls */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Checkbox: don't show again */}
          <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-stone-300 dark:border-stone-700 text-emerald-600 focus:ring-emerald-500"
            />
            <span>{locale === 'fr' ? 'Ne plus afficher au démarrage' : "Don't show on startup"}</span>
          </label>

          {/* Stepper Dots & Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 mr-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentStep === idx
                      ? 'w-6 bg-emerald-600 dark:bg-emerald-400'
                      : 'w-1.5 bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label={`Aller à l'étape ${idx + 1}`}
                />
              ))}
            </div>

            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Précédent' : 'Back'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm cursor-pointer"
            >
              <span>
                {currentStep === steps.length - 1
                  ? locale === 'fr'
                    ? "C'est parti !"
                    : 'Get started!'
                  : locale === 'fr'
                  ? 'Suivant'
                  : 'Next'}
              </span>
              {currentStep === steps.length - 1 ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
