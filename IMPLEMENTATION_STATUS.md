# Statut d'Implémentation — Forestor

**Date de validation :** 2026-09-28  
**Référence :** Cahier des charges Forestor / FAO FRA 2025

---

## 1. Tableau d'Avancement des Fonctionnalités

| Fonctionnalité | Statut | Détails de l'implémentation |
|---|---|---|
| **Audit technique préalable** | `DONE` | Réalisé et consigné dans `AUDIT.md`. |
| **Exploration réelle de l'API FAO FRA** | `DONE` | Vérifié sur `fra-data.fao.org/api-docs/swagger.json` et documenté dans `docs/FRA_API_MAPPING.md`. |
| **Client API officiel (`fraClient`)** | `DONE` | `src/api/fra/fraClient.ts` avec timeout, retry exponentiel et gestion proxy. |
| **Normalisation des données (`fraNormalizer`)** | `DONE` | `src/api/fra/fraNormalizer.ts` assurant le typage strict des données brutes FAO. |
| **Cache local & stratégie offline (`fraRepository`)** | `DONE` | Cache mémoire + `localStorage` avec TTL 24h, horodatage `updatedAt` et fallback baseline. |
| **Gestion stricte `null ≠ 0`** | `DONE` | Distingue `available`, `not_reported`, `missing`, `fao_estimate`. |
| **Calculs dérivés étiquetés ("Calcul Forestor")** | `DONE` | `src/domain/calculations.ts` avec mentions de formules et statut calculé explicite. |
| **Page d'Accueil (`HomePage`)** | `DONE` | Synthèse mondiale 2025 (4,06 Mds ha, 31,2%, 662 Gt C), recherche rapide, accès direct. |
| **Fiche Pays (`CountryPage`)** | `DONE` | Synthèse multi-catégories (A à K), graphiques temporels 1990–2025, sources nationales IFN. |
| **Carte Mondiale Interactive (`MapPage`)** | `DONE` | Atlas vectoriel SVG 110m autonome hors-ligne, zoom, pan, infobulles, distinguant données manquantes. |
| **Comparateur de Pays (`ComparePage`)** | `DONE` | Sélection libre parmi les 236 pays mondiaux, graphiques comparatifs et tableau matriciel sans jugement. |
| **Explorateur d'Indicateurs (`IndicatorsPage`)** | `DONE` | Répertoire complet des variables avec filtres par catégorie, unités et clés de lecture. |
| **Transparence & Sources (`DataSource` & `AboutSourcesPage`)** | `DONE` | Composant réutilisable avec cycle FRA 2025, liens officiels et page détaillée `/about/data-sources`. |
| **Internationalisation (i18n)** | `DONE` | Support complet Français (`fr.ts`) et Anglais (`en.ts`) avec commutateur d'en-tête instantané. |
| **PWA & Installabilité** | `DONE` | Service Worker (`vite-plugin-pwa`), manifest, icônes conformes (192, 512, maskable) et bouton d'installation. |
| **Tests automatisés (`npm run test`)** | `DONE` | Suite de tests Vitest validant la règle `null ≠ 0`, la normalisation, les calculs et les pays (16 tests passés). |
| **Documentation complète** | `DONE` | `README.md`, `AUDIT.md`, `IMPLEMENTATION_STATUS.md` et dossier `docs/` (`ARCHITECTURE`, `DATA_MODEL`, `FRA_API`, `DATA_QUALITY`, `PWA`, `CONTRIBUTING`). |
| **Agrégation satellitaire en direct** | `NOT_IMPLEMENTED` | Hors périmètre du FRA 2025 (prévu pour extension future). |
| **Couches cartographiques locales régionales** | `NOT_IMPLEMENTED` | Prévu pour extensions futures (données départementales ou parcellaires). |

---

## 2. Synthèse des Endpoints FAO FRA Utilisés

1. `GET /explorer/data` : Tables `extentOfForest`, `forestCharacteristics`, `forestAreaChange`, `forestAreaWithinProtectedAreas`, `forestOwnership`, `growingStockTotal`, `biomassStockTotal`, `carbonStockTotal`, `sustainableDevelopment15_1_1`, `disturbances`, `areaAffectedByFire`.
2. `GET /cycle-data/descriptions` : Textes méthodologiques et métadonnées d'inventaire nationales par pays.

---

## 3. Conformité aux Critères d'Acceptation

- [x] L'application démarre sans erreur (`npm run dev`)
- [x] Le build de production est validé (`npm run build`)
- [x] La PWA est fonctionnelle et installable (Service Worker et manifest vérifiés)
- [x] L'API FAO FRA 2025 est la source réelle (aucune URL fictive)
- [x] Les données sont rigoureusement normalisées
- [x] Les valeurs manquantes sont distinguées du zéro (`null ≠ 0`)
- [x] Fiche pays, carte mondiale, séries temporelles et comparateur fonctionnels
- [x] Traçabilité et source FAO affichées de manière omniprésente
- [x] Mode dégradé hors-ligne opérationnel avec cache et données de secours certifiées
- [x] Bilinguisme FR / EN opérationnel
- [x] Tests unitaires présents et passés au vert
- [x] Code propre validé par `tsc --noEmit`
- [x] Zéro chiffre inventé ou codé en dur sans source
