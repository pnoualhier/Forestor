import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { DataSource } from '../components/common/DataSource';
import {
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Scale,
  Database,
  CheckCircle,
  AlertCircle,
  Terminal,
} from 'lucide-react';

export const AboutSourcesPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Intégrité & Transparence Scientifique</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white">
          {t.aboutTitle}
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed">
          {t.aboutSubtitle}
        </p>
      </div>

      {/* Primary Source & Attribution */}
      <section className="p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            Attribution Officielle
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            Toutes les données relatives aux forêts, superficies, carbone, bois sur pied, perturbations et régénération proviennent directement de :
          </p>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-medium space-y-1">
            <p className="text-base font-bold text-emerald-800 dark:text-emerald-300">
              Food and Agriculture Organization of the United Nations (FAO)
            </p>
            <p>Global Forest Resources Assessment (FRA 2025)</p>
            <p className="text-xs text-stone-500 font-mono">Cycle d’évaluation : FRA 2025 (Période historique 1990–2025)</p>
          </div>
          <p>
            Les évaluations des ressources forestières mondiales (FRA) sont publiées tous les cinq ans par la FAO conformément aux directives approuvées par le Comité des forêts (COFO). Les données sont collectées auprès des correspondants nationaux désignés par les gouvernements membres et font l’objet d’une validation technique rigoureuse.
          </p>
        </div>
      </section>

      {/* Licensing (CC BY 4.0) */}
      <section className="p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <Scale className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            Licence des données & Conditions d'utilisation
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            Les données issues de la plateforme FAO FRA sont mises à disposition sous la licence :
          </p>
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300">
              Creative Commons Attribution 4.0 International (CC BY 4.0)
            </h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-200/80 mt-1">
              Vous êtes autorisé à partager, copier, distribuer et adapter les données, à condition de citer expressément la FAO comme source officielle.
            </p>
          </div>
          <p>
            L’application Forestor respecte scrupuleusement ces conditions en apposant la mention de source sur chaque donnée et graphique.
          </p>
        </div>
      </section>

      {/* Non-Affiliation Disclaimer */}
      <section className="p-6 sm:p-8 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-2xs space-y-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <h3 className="font-bold text-base">Avertissement de non-affiliation</h3>
        </div>
        <p>
          Forestor est un projet citoyen, scientifique et pédagogique indépendant. Forestor n’est pas développé, sponsorisé ou affilié formellement à l’Organisation des Nations Unies pour l’alimentation et l’agriculture (FAO). Les appellations employées sur les cartes et graphiques n’impliquent de la part de Forestor aucune prise de position quant au statut juridique des pays ou territoires.
        </p>
      </section>

      {/* Architecture & API Traceability */}
      <section className="p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <Terminal className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            Architecture technique de traçabilité
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <div className="font-mono text-xs bg-stone-900 text-stone-200 p-4 rounded-xl space-y-1 overflow-x-auto">
            <p className="text-emerald-400"># Flux de données Forestor</p>
            <p>API officielle FAO (fra-data.fao.org/api/explorer/data)</p>
            <p>  ↓ [Requête transparente avec vérification de schéma]</p>
            <p>Normalisation typée TypeScript (gestion stricte null ≠ 0)</p>
            <p>  ↓ [Cache local transparent avec horodatage]</p>
            <p>Calculs dérivés explicitement étiquetés "Calcul Forestor"</p>
            <p>  ↓ [Rendu visuel]</p>
            <p>Cartes choroplèthes vectorielles & graphiques d'évolution</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="https://fra-data.fao.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition"
            >
              <span>Accéder à la plateforme FAO FRA</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://fra-data.fao.org/api-docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-xs transition"
            >
              <span>Documentation Swagger OpenAPI</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <DataSource />
    </div>
  );
};
