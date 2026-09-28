# Mapping Officiel de l'API FAO FRA 2025 vers Forestor

**Document de référence technique**  
**Date :** 2026-09-28  
**Source :** FAO Global Forest Resources Assessment — Plateforme FRA 2025 (`https://fra-data.fao.org/`)  
**Spécification OpenAPI :** `https://fra-data.fao.org/api-docs/swagger.json`

---

## 1. Endpoints officiels utilisés

### Endpoint 1 : Extraction de données multi-pays et multi-tables
- **Méthode :** `GET`
- **Chemin :** `/api/explorer/data` (relocalisé via proxy local `/fao-api/explorer/data`)
- **Paramètres :**
  - `assessmentName` (requis) : `"fra"`
  - `countryISOs[]` (requis) : Tableau de codes ISO3 (ex: `["FRA", "BRA", "CAN"]`)
  - `tableNames[]` (requis) : Nom de la table FRA (ex: `["extentOfForest", "carbonStockTotal"]`)
  - `columns[]` (optionnel) : Années ou périodes (ex: `["1990", "2000", "2010", "2015", "2020", "2025"]`)
  - `variables[]` (optionnel) : Filtrage de variables spécifiques
- **Exemple de réponse réelle :**
```json
{
  "fra": {
    "2025": {
      "FRA": {
        "extentOfForest": {
          "1990": {
            "forestArea": { "odp": true, "raw": "14436", "odpId": 238 },
            "otherWoodedLand": { "odp": true, "raw": "1648.0", "odpId": 238 },
            "totalLandArea": { "odp": true, "raw": "54909", "odpId": 238 }
          },
          "2025": {
            "forestArea": { "odp": true, "raw": "17795.00", "odpId": 242 },
            "otherWoodedLand": { "odp": true, "raw": "632.00", "odpId": 242 },
            "totalLandArea": { "odp": true, "raw": "54756.00", "odpId": 242 }
          }
        }
      }
    }
  }
}
```

### Endpoint 2 : Métadonnées, sources et descriptions nationales
- **Méthode :** `GET`
- **Chemin :** `/api/cycle-data/descriptions`
- **Paramètres :**
  - `assessmentName` : `"fra"`
  - `cycleName` : `"2025"`
  - `countryIso` : Code ISO3 (ex: `"FRA"`)
- **Utilité :** Traçabilité directe vers les sources nationales (ex: Inventaire Forestier National, IGN, IBGE).

---

## 2. Table de correspondance des indicateurs (Mapping FAO -> Forestor)

| Catégorie Forestor | Table FAO FRA 2025 | Variable FAO | Code Forestor | Unité officielle FAO | Description FAO | Années typiques |
|---|---|---|---|---|---|---|
| **A. Surface forestière** | `extentOfForest` | `forestArea` | `forest_area` | 1 000 ha | Terres occupant une superficie de plus de 0,5 ha avec des arbres d'une hauteur supérieure à 5 m et un couvert arboré de plus de 10%. | 1990, 2000, 2005, 2010, 2015, 2020, 2025 |
| **A. Surface forestière** | `extentOfForest` | `otherWoodedLand` | `other_wooded_land` | 1 000 ha | Terres avec couvert arboré de 5 à 10% ou arbustif supérieur à 10%. | 1990–2025 |
| **A. Surface forestière** | `extentOfForest` | `totalLandArea` | `total_land_area` | 1 000 ha | Superficie totale des terres émergées du pays. | 1990–2025 |
| **A. Surface forestière** | `sustainableDevelopment15_1_1` | `forestAreaProportionLandArea2015` | `forest_proportion` | % | Part de la superficie forestière rapportée à la superficie terrestre totale (ODD 15.1.1). | 2000, 2005, 2010, 2015, 2020, 2025 |
| **B. Évolution et dynamique** | `forestAreaChange` | `forestAreaNetChangeFrom1a` | `forest_net_change` | 1 000 ha/an | Variation annuelle nette de la superficie forestière (gains - pertes). | 1990-2000, 2000-2010, 2010-2015, 2015-2020, 2020-2025 |
| **C. Régénération** | `forestCharacteristics` | `naturalForestArea` | `natural_forest` | 1 000 ha | Forêt naturellement régénérée composée d'espèces indigènes. | 1990, 2000, 2010, 2015, 2020, 2025 |
| **C. Régénération** | `forestCharacteristics` | `plantedForest` | `planted_forest` | 1 000 ha | Forêt établie par plantation et/ou ensemencement artificiel. | 1990, 2000, 2010, 2015, 2020, 2025 |
| **C. Régénération** | `forestCharacteristics` | `plantationForestArea` | `plantation_forest` | 1 000 ha | Forêt de plantation intensive à vocation de production ou protection. | 1990–2025 |
| **D. Forêt primaire** | `forestCharacteristics` | `primaryForest` | `primary_forest` | 1 000 ha | Forêt naturellement régénérée d'espèces indigènes sans trace visible d'activité humaine et processus écologiques non perturbés. | 1990–2025 |
| **F. Biomasse** | `biomassStockTotal` | `forest_above_ground` | `biomass_above_ground` | Million tonnes | Biomasse vivante aérienne (tronc, écorce, branches, feuillage). | 1990, 2000, 2010, 2015, 2020, 2025 |
| **F. Biomasse** | `biomassStockTotal` | `forest_below_ground` | `biomass_below_ground` | Million tonnes | Biomasse vivante souterraine (racines vivantes > 2 mm). | 1990–2025 |
| **F. Stock de carbone** | `carbonStockTotal` | `carbon_forest_above_ground` | `carbon_above_ground` | Million tonnes C | Carbone stocké dans la biomasse aérienne. | 1990, 2000, 2010, 2015, 2020, 2025 |
| **F. Stock de carbone** | `carbonStockTotal` | `carbon_forest_below_ground` | `carbon_below_ground` | Million tonnes C | Carbone stocké dans la biomasse souterraine. | 1990–2025 |
| **F. Stock de carbone** | `carbonStockTotal` | `carbon_forest_soil` | `carbon_soil` | Million tonnes C | Carbone organique du sol minéral et organique à 30 cm de profondeur. | 1990–2025 |
| **F. Stock de carbone** | `carbonStockTotal` | `carbon_forest_litter` | `carbon_litter` | Million tonnes C | Carbone dans la litière forestière. | 1990–2025 |
| **H. Protection** | `forestAreaWithinProtectedAreas` | `forest_area_within_protected_areas` | `protected_forest` | 1 000 ha | Superficie forestière située dans des aires protégées formellement désignées. | 1990, 2000, 2010, 2015, 2020, 2025 |
| **H. Protection** | `forestAreaWithinProtectedAreas` | `forest_area_with_long_term_management_plan` | `forest_with_mgmt_plan` | 1 000 ha | Superficie forestière faisant l'objet d'un plan de gestion à long terme documenté. | 1990–2025 |
| **I. Propriété** | `forestOwnership` | `public_ownership` | `ownership_public` | 1 000 ha | Forêts appartenant à l'État ou à des collectivités publiques. | 1990, 2000, 2010, 2015, 2020 |
| **I. Propriété** | `forestOwnership` | `private_ownership` | `ownership_private` | 1 000 ha | Forêts appartenant à des particuliers, communautés ou entreprises privées. | 1990–2020 |
| **K. Volume sur pied** | `growingStockTotal` | `forest` | `growing_stock_forest` | Million m³ | Volume de bois sur pied sur écorce de tous les arbres vivants > 10 cm de diamètre. | 1990, 2000, 2010, 2015, 2020, 2025 |
| **E. Incendies** | `areaAffectedByFire` | `of_which_on_forest` | `fire_affected_forest` | 1 000 ha | Superficie forestière affectée par des feux durant l'année civile. | 2000–2022 |

---

## 3. Règle absolue de gestion des données manquantes

Dans le schéma JSON FAO FRA :
- Si un nœud a `"raw": null`, le statut est `missing` ou `not_reported`.
- Si un pays n'a pas transmis la valeur pour une variable spécifique (ex: France pour `primaryForest`), l'application Forestor affiche :
  **"Non disponible ou non communiqué par le pays"**
- En aucun cas la valeur `null` n'est convertie en `0`.

---

## 4. Calculs dérivés explicites

Lorsque Forestor effectue un calcul (non fourni directement par la FAO), un label visuel distinctif **"Calcul Forestor"** est apposé avec la mention de la méthode :
- **Variation absolue 1990–2025 :** $\Delta = \text{valeur}_{2025} - \text{valeur}_{1990}$
- **Variation relative 1990–2025 :** $\Delta\% = \frac{\text{valeur}_{2025} - \text{valeur}_{1990}}{\text{valeur}_{1990}} \times 100$
- **Densité de carbone :** $\text{Carbone total} / \text{Surface forestière}$ (tonnes C/ha)
- **Part de forêt protégée calculée :** $(\text{Forêt protégée} / \text{Surface forestière totale}) \times 100$
