# Forestor — Global Forest Resources Assessment (FAO FRA 2025)

**Forestor** est une application web et PWA moderne, scientifique et indépendante permettant d'explorer, de comprendre, de comparer et de visualiser les données forestières mondiales issues du **Global Forest Resources Assessment (FRA 2025)** de l’Organisation des Nations Unies pour l’alimentation et l’agriculture (**FAO**).

---

## 🌲 Objectif du Projet

Forestor répond de manière simple et factuelle à des questions clés telles que :
- Quelle est la superficie forestière d'un pays et sa part dans le territoire ?
- Comment la couverture forestière a-t-elle évolué depuis 1990 ?
- Quelles sont les dynamiques annuelles nettes d'expansion et de recul ?
- Quelles quantités de biomasse et de carbone sont stockées dans les forêts ?
- Quelle est la part de forêts primaires, naturellement régénérées ou plantées ?
- Quelles proportions de forêts bénéficient d'un statut d'aire protégée ou de plan de gestion ?
- Comment comparer objectivement plusieurs pays sans biais normatif ni classement partisan ?

L'application privilégie la **compréhension scientifique et la traçabilité rigoureuse** des données plutôt que leur simple accumulation.

---

## 🚀 Fonctionnalités Clés

1. **Page d'Accueil & Vue Mondiale 2025 :** Synthèse dynamique des chiffres clés planétaires (4,06 Mds ha, 31,2% des terres, 662 Gt de carbone), recherche instantanée parmi 236 pays et aperçu cartographique.
2. **Fiches Pays Détaillées (`/country/:iso3`) :** Synthèse par catégorie fonctionnelle (Surface, Évolution, Régénération, Forêts primaires, Carbone, Protection, Propriété, Bois sur pied), séries chronologiques 1990–2025, et traçabilité vers les inventaires forestiers nationaux (IFN).
3. **Atlas Mondial Interactif (`/map`) :** Carte vectorielle choroplèthe mondiale SVG fluide, autonome hors-ligne, avec zoom/panoramique, sélection d'indicateur, sélection d'année (1990–2025) et infobulles informatives.
4. **Comparateur Multi-Pays (`/compare`) :** Sélection libre de n'importe quel pays du monde, visualisations en barres relatives et matrice comparative détaillée.
5. **Répertoire d'Indicateurs (`/indicators`) :** Définitions méthodologiques officielles de la FAO, unités précises et clés de lecture pour éviter les erreurs d'interprétation.
6. **Règle Absolue d'Intégrité : `null ≠ 0` :** Une donnée non communiquée ou manquante pour un pays n'est jamais transformée en zéro.
7. **Traçabilité des Calculs Dérivés :** Tout calcul calculé par Forestor porte un badge distinctif « Calcul Forestor » avec la formule affichée.
8. **PWA Installable & Offline-First :** Manifest PWA complet, icônes conformes (192px, 512px, maskable), bouton d'installation intégré et cache local permettant l'utilisation dégradée sans réseau.
9. **Bilingue FR / EN :** Interface et définitions disponibles en français et en anglais avec commutateur instantané.

---

## 🏛️ Architecture & Technologies

- **Frontend :** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion.
- **Cartographie :** Rendu vectoriel SVG basé sur la topologie Natural Earth 110m (107 Ko) via `topojson-client`, 100% autonome sans clé API externe.
- **Client API FAO :** `fraClient` (requêtes HTTP ciblées avec gestion d'erreurs, timeouts et retry), `fraRepository` (cache mémoire et localStorage), et `fraNormalizer` (typage strict).
- **Proxy Transparent :** Proxy `/fao-api/` résolvant les restrictions CORS sans backend applicatif propriétaire.
- **PWA :** `vite-plugin-pwa` avec Workbox pour la mise en cache des assets statiques et des réponses API.
- **Tests :** Vitest avec tests unitaires pour la qualité des données, la normalisation, les calculs et l'i18n.

---

## 📦 Installation & Démarrage

```bash
# 1. Cloner et installer les dépendances
npm install

# 2. Lancer l'environnement de développement (port 3000)
npm run dev

# 3. Lancer les tests unitaires
npm run test

# 4. Vérifier les types TypeScript
npm run lint

# 5. Compiler pour la production
npm run build

# 6. Prévisualiser le build de production
npm run preview
```

---

## 📊 Endpoints Officiels FAO FRA Utilisés

Forestor se connecte directement aux endpoints officiels documentés dans le Swagger OpenAPI de la FAO (`https://fra-data.fao.org/api-docs/`) :
- `GET /explorer/data` : Données numériques par pays et par table (`extentOfForest`, `forestCharacteristics`, `forestAreaChange`, `forestAreaWithinProtectedAreas`, `forestOwnership`, `growingStockTotal`, `carbonStockTotal`, `sustainableDevelopment15_1_1`, `disturbances`, `areaAffectedByFire`).
- `GET /cycle-data/descriptions` : Métadonnées méthodologiques et commentaires narratifs des inventaires nationaux.

---

## 📜 Attribution & Licence

- **Source primaire officielle :** Food and Agriculture Organization of the United Nations (FAO) — Global Forest Resources Assessment (FRA 2025).
- **Conditions de mise à disposition des données :** Licence Creative Commons Attribution 4.0 International (**CC BY 4.0**).
- **Avertissement de non-affiliation :** Forestor est une application scientifique et pédagogique indépendante et n'est pas une application officielle de la FAO.
