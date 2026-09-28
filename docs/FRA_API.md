# Documentation API FAO FRA 2025 — Intégration Forestor

## 1. Vue d'ensemble

- **Source Primaire :** Food and Agriculture Organization of the United Nations (FAO)
- **Programme :** Global Forest Resources Assessment (FRA)
- **Cycle :** FRA 2025
- **URL Publique de la Plateforme :** `https://fra-data.fao.org/`
- **Documentation OpenAPI (Swagger) :** `https://fra-data.fao.org/api-docs/`
- **Fichier OpenAPI :** `https://fra-data.fao.org/api-docs/swagger.json`

---

## 2. Endpoints Exploités

### A. `GET /explorer/data`
Récupère les données temporelles publiées par pays et par table.

#### Paramètres :
- `assessmentName` (string, requis) : `"fra"`
- `countryISOs[]` (array[string], requis) : Liste des codes pays ISO3 (ex: `FRA`, `BRA`, `CAN`)
- `tableNames[]` (array[string], requis) : Tables FRA demandées :
  - `extentOfForest` : Superficie forestière et autres terres boisées
  - `forestCharacteristics` : Régénération naturelle, plantée et forêt primaire
  - `forestAreaChange` : Variation nette annuelle de superficie
  - `forestAreaWithinProtectedAreas` : Aires protégées et plans de gestion
  - `forestOwnership` : Propriété publique, privée, autre
  - `growingStockTotal` : Volume de bois sur pied
  - `biomassStockTotal` : Biomasse aérienne et souterraine
  - `carbonStockTotal` : Carbone dans la biomasse et les sols
  - `disturbances` : Insectes, maladies, intempéries
  - `areaAffectedByFire` : Incendies et feux de végétation
  - `sustainableDevelopment15_1_1` : Proportion de couverture du territoire

#### Structure de réponse vérifiée :
```json
{
  "fra": {
    "2025": {
      "FRA": {
        "extentOfForest": {
          "1990": {
            "forestArea": { "odp": true, "raw": "14436", "odpId": 238 },
            "totalLandArea": { "odp": true, "raw": "54909", "odpId": 238 }
          },
          "2025": {
            "forestArea": { "odp": true, "raw": "17795.00", "odpId": 242 },
            "totalLandArea": { "odp": true, "raw": "54756.00", "odpId": 242 }
          }
        }
      }
    }
  }
}
```

### B. `GET /cycle-data/descriptions`
Récupère les textes narratifs, les définitions nationales et les sources d'inventaire transmises par le pays.

#### Paramètres :
- `assessmentName` : `"fra"`
- `cycleName` : `"2025"`
- `countryIso` : Code ISO3 (ex: `"FRA"`)

---

## 3. Stratégie de Résolution CORS

L'API `fra-data.fao.org` ne renvoie pas d'en-tête `Access-Control-Allow-Origin` autorisant les navigateurs tiers.
Forestor résout cette contrainte via un proxy transparent :
- En développement : Proxy Vite configuré dans `vite.config.ts` (`/fao-api/*` -> `https://fra-data.fao.org/api/*`).
- En production : Serveur Express dans `server.ts` relayant le flux sans altération.

---

## 4. Gestion du Cache et Mode Hors-ligne

1. **Mémoire vive (RAM) :** Accès instantané aux requêtes récentes.
2. **Stockage Local (`localStorage` / IndexedDB) :** Conservation des requêtes pour une durée de 24h avec indication de la date de synchronisation (`updatedAt`).
3. **Données de Référence Certifiées (`baselineData.ts`) :** Utilisées en secours total lorsque le terminal n'a aucune connexion et que le cache est vide.
