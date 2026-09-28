export type IndicatorCategory =
  | 'surface'        // A. Surface forestière
  | 'evolution'      // B. Évolution et dynamique
  | 'regeneration'   // C. Régénération
  | 'primary'        // D. Forêts primaires
  | 'disturbances'   // E. Perturbations & feux
  | 'biomass_carbon' // F. Biomasse et carbone
  | 'protection'     // H. Protection
  | 'ownership'      // I. Propriété
  | 'growing_stock'; // K. Bois sur pied

export type QualityStatus =
  | 'available'       // Donnée officielle rapportée
  | 'missing'         // Non disponible
  | 'not_reported'    // Non communiqué par le pays
  | 'not_applicable'  // Non applicable
  | 'calculated'      // Calcul dérivé explicite
  | 'fao_estimate';   // Estimation FAO

export interface ForestIndicator {
  id: string;
  code: string;
  tableName: string;
  variableName: string;
  category: IndicatorCategory;
  nameFr: string;
  nameEn: string;
  unit: string;
  unitShort: string;
  descriptionFr: string;
  descriptionEn: string;
  methodologyFr: string;
  methodologyEn: string;
  defaultYears: number[];
  isCalculated?: boolean;
}

export interface IndicatorCategoryMeta {
  id: IndicatorCategory;
  labelFr: string;
  labelEn: string;
  iconName: string;
  descriptionFr: string;
  descriptionEn: string;
}
