# Modèle de Données — Forestor

## 1. Entités Principales

### A. Country (Pays)
```typescript
interface Country {
  iso3: string;        // Code ISO 3166-1 alpha-3 (ex: "FRA", "BRA")
  iso2: string;        // Code ISO 3166-1 alpha-2 (ex: "fr", "br")
  isoNumeric?: string; // Code numérique à 3 chiffres (ex: "250", "076")
  nameEn: string;      // Nom usuel en anglais
  nameFr: string;      // Nom usuel en français
  region: string;      // Continent / Région géographique ONU
  subregion: string;   // Sous-région
}
```

### B. ForestIndicator (Indicateur Forestier)
```typescript
interface ForestIndicator {
  id: string;                     // Identifiant unique Forestor (ex: "forest_area")
  code: string;                   // Identifiant de la table/variable FRA (ex: "1a_forestArea")
  tableName: string;              // Nom de la table officielle FRA 2025 (ex: "extentOfForest")
  variableName: string;           // Nom de la variable dans la table FRA (ex: "forestArea")
  category: IndicatorCategory;    // Catégorie fonctionnelle (surface, biomasse, etc.)
  nameFr: string;                 // Titre en français
  nameEn: string;                 // Titre en anglais
  unit: string;                   // Unité officielle (ex: "1 000 ha", "Mt C", "%")
  unitShort: string;              // Symbole court (ex: "kha", "Mt")
  descriptionFr: string;          // Définition FAO
  descriptionEn: string;
  methodologyFr: string;          // Clé de lecture méthodologique
  methodologyEn: string;
  defaultYears: number[];         // Années de référence de la série temporelle
}
```

### C. ForestObservation (Observation Ponctuelle)
```typescript
interface ForestObservation {
  countryIso3: string;            // Code ISO3
  indicatorId: string;            // Identifiant de l'indicateur
  year: number | string;          // Année (ex: 2025) ou période (ex: "2020-2025")
  value: number | null;           // Valeur numérique ou null (JAMAIS 0 par défaut)
  unit: string;                   // Unité
  status: QualityStatus;          // Statut d'évaluation de la donnée
  isCalculated: boolean;          // Vrai s'il s'agit d'un calcul dérivé
  source: string;                 // Mention de source
  raw?: any;                      // Nœud brut originel de l'API FAO
}
```

---

## 2. Statuts de Qualité (`QualityStatus`)

| Statut | Signification | Comportement UI |
|---|---|---|
| `available` | Valeur officielle transmise par le pays et validée par la FAO. | Valeur mise en avant avec badge vert "Donnée officielle FAO". |
| `not_reported` | Le pays n'a pas transmis de valeur pour cette variable (`raw: null`). | Affichage explicite : « Non communiqué par le pays » (distinct de 0). |
| `missing` | Nœud manquant ou variable non requêtée. | Affichage : « Non disponible ». |
| `fao_estimate` | Donnée extrapolée ou estimée par les experts FAO. | Badge bleu "Estimation FAO". |
| `calculated` | Calcul dérivé transparent (ex: variation 1990-2025). | Badge cyan « Calcul Forestor » avec infobulle affichant la formule mathématique. |
