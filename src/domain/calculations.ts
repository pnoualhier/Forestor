export interface DerivedCalculationResult {
  value: number | null;
  unit: string;
  isCalculated: true;
  attribution: 'Calcul Forestor';
  formula: string;
  status: 'calculated' | 'missing';
}

/**
 * Calculates absolute change: value_end - value_start
 * Returns null if any input is missing. NEVER converts missing to 0.
 */
export function calculateAbsoluteChange(
  startVal: number | null | undefined,
  endVal: number | null | undefined,
  unit: string,
  startYear = 1990,
  endYear = 2025
): DerivedCalculationResult {
  if (startVal === null || startVal === undefined || endVal === null || endVal === undefined) {
    return {
      value: null,
      unit,
      isCalculated: true,
      attribution: 'Calcul Forestor',
      formula: `valeur_${endYear} - valeur_${startYear}`,
      status: 'missing',
    };
  }

  const diff = Number((endVal - startVal).toFixed(2));
  return {
    value: diff,
    unit,
    isCalculated: true,
    attribution: 'Calcul Forestor',
    formula: `valeur_${endYear} (${endVal}) - valeur_${startYear} (${startVal})`,
    status: 'calculated',
  };
}

/**
 * Calculates relative change in percentage: ((value_end - value_start) / value_start) * 100
 * Returns null if startVal is 0 or any input is missing.
 */
export function calculateRelativeChange(
  startVal: number | null | undefined,
  endVal: number | null | undefined,
  startYear = 1990,
  endYear = 2025
): DerivedCalculationResult {
  if (
    startVal === null ||
    startVal === undefined ||
    endVal === null ||
    endVal === undefined ||
    startVal === 0
  ) {
    return {
      value: null,
      unit: '%',
      isCalculated: true,
      attribution: 'Calcul Forestor',
      formula: `((valeur_${endYear} - valeur_${startYear}) / valeur_${startYear}) × 100`,
      status: 'missing',
    };
  }

  const pct = Number((((endVal - startVal) / startVal) * 100).toFixed(2));
  return {
    value: pct,
    unit: '%',
    isCalculated: true,
    attribution: 'Calcul Forestor',
    formula: `((${endVal} - ${startVal}) / ${startVal}) × 100`,
    status: 'calculated',
  };
}

/**
 * Converts 1000 ha to Million Hectares (Mha)
 * 1 000 ha = 0.001 Mha
 */
export function toMha(val1000Ha: number | null | undefined): number | null {
  if (val1000Ha === null || val1000Ha === undefined || isNaN(val1000Ha)) return null;
  return Number((val1000Ha / 1000).toFixed(2));
}

/**
 * Calculates percentage of protected forest: (protected_area / total_forest_area) * 100
 */
export function calculateProtectedRatio(
  protectedArea1000Ha: number | null | undefined,
  forestArea1000Ha: number | null | undefined
): DerivedCalculationResult {
  if (
    protectedArea1000Ha === null ||
    protectedArea1000Ha === undefined ||
    forestArea1000Ha === null ||
    forestArea1000Ha === undefined ||
    forestArea1000Ha <= 0
  ) {
    return {
      value: null,
      unit: '%',
      isCalculated: true,
      attribution: 'Calcul Forestor',
      formula: `(forêt_protégée / surface_forestière_totale) × 100`,
      status: 'missing',
    };
  }

  const ratio = Number(((protectedArea1000Ha / forestArea1000Ha) * 100).toFixed(1));
  return {
    value: ratio,
    unit: '%',
    isCalculated: true,
    attribution: 'Calcul Forestor',
    formula: `(${protectedArea1000Ha} / ${forestArea1000Ha}) × 100`,
    status: 'calculated',
  };
}
