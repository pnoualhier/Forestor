# Audit Technique — Forestor

**Date de réalisation :** 2026-09-28  
**Projet :** Forestor — Application d'exploration des ressources forestières mondiales (FAO FRA 2025)  
**Environnement :** Node.js 22, Vite 8, React 19, TypeScript 7

---

## 1. État des lieux du dépôt existant

### Stack technique identifiée
- **Runtime & Bundler :** Vite 8.3 avec `@vitejs/plugin-react` v6.1.1
- **Langage :** TypeScript 7.0.2 avec configuration stricte dans `tsconfig.json`
- **Framework UI :** React 19.0.1 / React-DOM 19.0.1
- **Styling :** Tailwind CSS v4 via `@tailwindcss/vite` v4.3.3 et `@import "tailwindcss";` dans `src/index.css`
- **Icônes :** Lucide React (`lucide-react`) v0.546.0
- **Animations :** Motion (`motion`) v12.23.24
- **Serveur & Proxy potentiel :** Express 4.21.2 & TSX 4.21.0 déjà installés

### Structure des dossiers existante
```
/
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

---

## 2. Points réutilisables & forces

1. **Stack moderne et rapide :** React 19 + Vite 8 assure des temps de démarrage ultra-rapides (<100ms) et un rechargement instantané.
2. **Tailwind CSS v4 :** Permet une stylisation sobre, scientifique, responsive, respectant la charte naturelle (verts forestiers, neutres ardoise/beige).
3. **TypeScript de bout en bout :** Typage strict du modèle de données (ISO3, indicateurs, observations temporelles, statuts de données `available`, `missing`, `not_reported`).
4. **Vite Proxy intégré :** Permet de relayer de manière transparente les requêtes `/fao-api/*` vers l'API officielle `https://fra-data.fao.org/api/*` en contournant les restrictions CORS du navigateur sans introduire de backend applicatif propriétaire.

---

## 3. Analyse de l'API FAO FRA 2025

### Endpoints officiels Swagger (`https://fra-data.fao.org/api-docs/swagger.json`)
- `GET /explorer/data` : Endpoint principal d'extraction multivariable et multi-pays pour FRA 2025.
  - Paramètres requis : `assessmentName=fra`, `countryISOs[]=...`, `tableNames[]=...`
  - Paramètres optionnels : `columns[]` (années : 1990, 2000, 2010, 2015, 2020, 2025...), `variables[]`
- `GET /cycle-data/descriptions` : Métadonnées méthodologiques, sources nationales et textes explicatifs.
- `GET /cycle-data/national-data-points` : Points de données nationaux bruts et classifications nationales.

### Constatations fondamentales issues des tests réels
1. **Pas de headers CORS natifs :** L'API `fra-data.fao.org` ne renvoie pas `Access-Control-Allow-Origin: *` aux navigateurs tiers. Un proxy transparent côté client de développement (`vite.config.ts`) et de déploiement (Express) est indispensable pour permettre les requêtes depuis le navigateur sans altérer les données.
2. **Gestion rigoureuse du `null` vs `0` :** Par exemple, pour la France (`FRA`), `primaryForest` vaut `null` (non déclaré car catégorie non distincte en forêt tempérée exploitée), tandis que pour le Brésil (`BRA`), elle vaut `224 501.74 (1000 ha)`. Il est impératif de ne jamais convertir `null` en `0`.
3. **Unités standardisées FAO :**
   - Superficies : 1 000 ha (1 000 ha = 10 km² = 0,01 Mha).
   - Pourcentage du territoire : `%`.
   - Biomasse et carbone : Millions de tonnes métriques.
   - Volume de bois sur pied : Millions de m³.
   - Variation nette : 1 000 ha / an.

---

## 4. Dépendances ajoutées et configuration PWA

- `vite-plugin-pwa` : Génération du Service Worker, precaching des assets statiques, manifest PWA conforme avec icônes et support offline.
- `topojson-client` : Rendu de la carte mondiale vectorielle SVG compacte (107 Ko), 100% autonome et fonctionnant hors-ligne sans dépendance à des tuiles externes.
- `vitest` : Exécution des tests unitaires et d'intégration (`npm run test`).

---

## 5. Risques identifiés & mitigations

| Risque | Impact | Stratégie de mitigation |
|---|---|---|
| Latence ou indisponibilité momentanée de l'API FAO | Écran blanc | Cache persistant dans `IndexedDB`/`localStorage` avec horodatage "Mis à jour le..." et données de référence pré-embarquées (fallback gracieux). |
| Absence de données pour un pays | Fausse interprétation | Statut explicite : "Non disponible", "Non communiqué" au lieu de `0`. |
| Confusion entre calcul dérivé et donnée officielle | Perte de neutralité | Badge explicite "Calcul Forestor" avec formule affichée, distinct de "Donnée FAO FRA 2025". |
| Accessibilité et mobile | Graphiques illisibles sur smartphone | Vues adaptatives (cartes compactes, infobulles tactiles, tableau accessible). |

---

## 6. Architecture cible

```
src/
├── api/
│   └── fra/
│       ├── fraClient.ts        # Client HTTP avec retry, gestion d'erreurs et proxy
│       ├── fraRepository.ts    # Cache mémoire/IndexedDB, requêtes ciblées
│       ├── fraNormalizer.ts    # Normalisation JSON FAO -> Types Forestor
│       └── fraTypes.ts         # Types stricts du schéma FAO
├── domain/
│   ├── models/                 # Country, Indicator, Observation, QualityStatus
│   ├── indicators/             # Registre des indicateurs FAO FRA 2025
│   └── calculations/           # Variations absolues et relatives clairement étiquetées
├── data/
│   ├── countries.ts            # 236 pays officiels FRA 2025 (ISO3, ISO2, noms FR/EN, région)
│   ├── worldTopology.ts        # Topologie mondiale simplifiée pour choroplèthe
│   └── baselineData.ts         # Données mondiales et régionales certifiées pour l'offline
├── components/
│   ├── common/                 # Header, Footer, DataSource, OfflineIndicator, PWAInstallButton
│   ├── country/                # CountryCard, CountryHeader, CountrySynthese
│   ├── charts/                 # HistoricalTrendChart, ComparisonChart, BreakdownChart
│   ├── map/                    # WorldChoroplethMap, MapLegend, MapTooltip
│   └── ui/                     # Badges, Tabs, SearchInput, MetricDisplay
├── pages/
│   ├── HomePage.tsx            # Synthèse mondiale, recherche rapide, accès direct
│   ├── CountryPage.tsx         # Fiche pays complète par catégorie
│   ├── ComparePage.tsx         # Comparateur multi-pays sans jugement
│   ├── MapPage.tsx             # Carte mondiale interactive par indicateur et année
│   ├── IndicatorsPage.tsx      # Explorateur de variables et définitions FAO
│   ├── IndicatorDetailPage.tsx # Détail méthodologique et répartition mondiale
│   └── AboutSourcesPage.tsx    # Attribution FAO, méthodologie, licence CC BY 4.0
├── hooks/
│   ├── useFraData.ts           # Hook réactif de requête avec cache et état offline
│   ├── usePWAInstall.ts        # Hook d'installation PWA conforme
│   └── useI18n.ts              # Gestion des langues FR / EN
├── i18n/
│   ├── fr.ts                   # Textes et définitions en français
│   └── en.ts                   # Textes et définitions en anglais
└── pwa/
    └── registerSW.ts           # Enregistrement du Service Worker
```
