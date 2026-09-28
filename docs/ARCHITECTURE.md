# Architecture Technique — Forestor

## 1. Principes Fondateurs

1. **Fiabilité & Intégrité Scientifique :** Aucune statistique n'est inventée ou interpolée silencieusement. Toutes les données sont sourcées de manière transparente auprès du programme FAO FRA 2025.
2. **Gestion Stricte de l'Absence de Données :** `null ≠ 0`. Une absence de déclaration par un pays est distincte d'une valeur nulle.
3. **Traçabilité des Calculs Dérivés :** Tout calcul qui n'est pas une donnée brute FAO est explicitement étiqueté « Calcul Forestor » avec sa formule.
4. **Pas de Backend Applicatif Propriétaire :** Le frontend dialogue avec l'API officielle FAO via un proxy transparent résolvant les contraintes CORS du navigateur.
5. **Résilience & Offline-First :** Fonctionnement autonome grâce au cache local HTTP / IndexedDB / Service Worker et à des données de référence certifiées.

---

## 2. Diagramme de Flux de Données

```
Plateforme Officielle FAO FRA (fra-data.fao.org)
                  │
                  ▼
          Proxy /fao-api/
     (Vite en Dev / Express en Prod)
                  │
                  ▼
             fraClient
  (Fetch avec timeout, retries exponentiels,
     en-têtes et gestion des erreurs)
                  │
                  ▼
            fraRepository
   (Cache local 24h, horodatage,
 fallback vers données de référence FAO)
                  │
                  ▼
            fraNormalizer
  (Évaluation de qualité, typage TypeScript,
   extraction des synthèses par pays)
                  │
                  ▼
            React UI & Hooks
   (useFraData, WorldMap, TrendLineChart,
    ComparisonBarChart, CountryPage, etc.)
```

---

## 3. Structure Détaillée des Modules

- `src/api/fra/` : Couche d'infrastructure réseau et persistance.
  - `fraClient.ts` : Appels HTTP vers `/api/explorer/data` et `/api/cycle-data/descriptions`.
  - `fraRepository.ts` : Gestion du cache mémoire et `localStorage`, horodatage `updatedAt`.
  - `fraNormalizer.ts` : Décomposition de la hiérarchie JSON FAO vers les observations Forestor.
- `src/domain/` : Règles métier et intégrité.
  - `quality.ts` : Qualification des statuts (`available`, `not_reported`, `fao_estimate`, `calculated`).
  - `calculations.ts` : Variations 1990–2025 absolues et relatives, part de forêt protégée, conversions.
- `src/data/` : Référentiels statiques.
  - `countries.ts` : Les 236 pays officiels du cycle FRA 2025 avec codes ISO3, ISO2, numérique, noms FR/EN et régions.
  - `indicators.ts` : Registre des indicateurs couvrant les catégories A à L (Surface, Évolution, Régénération, Primaires, Carbone, Protection, Propriété, Bois sur pied, Feux).
  - `baselineData.ts` : Données de référence réelles issues de l'API FAO pour assurer le mode déconnecté immédiat.
- `src/components/` : Composants UI réutilisables.
  - `common/` : En-tête, pied de page, bannière hors-ligne, sélecteur de recherche, composant `DataSource`.
  - `charts/` : Graphiques vectoriels temporels (`TrendLineChart`) et comparatifs (`ComparisonBarChart`).
  - `map/` : Atlas mondial vectoriel SVG avec zoom, pan, infobulles et distinction des données manquantes.
- `src/pages/` : Pages fonctionnelles de l'application.
  - `HomePage` : Vue d'ensemble mondiale, chiffres clés FRA 2025, recherche rapide, aperçu de l'atlas.
  - `CountryPage` : Fiche d'identité forestière par pays (/country/:iso3) avec métadonnées d'inventaire national.
  - `ComparePage` : Comparateur multi-pays sans biais normatif.
  - `MapPage` : Atlas cartographique interactif par indicateur et année.
  - `IndicatorsPage` : Explorateur exhaustif des indicateurs avec clés de lecture méthodologiques.
  - `AboutSourcesPage` : Attribution, licence CC BY 4.0 et transparence méthodologique.
