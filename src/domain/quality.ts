import { QualityStatus } from '../types/indicator';

/**
 * Maps raw FAO API node values to explicit QualityStatus
 * Ensures null is NEVER converted to 0
 */
export function evaluateQualityStatus(rawNode: any): {
  status: QualityStatus;
  value: number | null;
  labelFr: string;
  labelEn: string;
} {
  if (rawNode === undefined || rawNode === null) {
    return {
      status: 'missing',
      value: null,
      labelFr: 'Non disponible',
      labelEn: 'Not available',
    };
  }

  // Raw property in FAO FRA JSON node
  const rawVal = typeof rawNode === 'object' ? rawNode.raw : rawNode;

  if (rawVal === null || rawVal === undefined || rawVal === '' || rawVal === 'null') {
    return {
      status: 'not_reported',
      value: null,
      labelFr: 'Non communiqué par le pays',
      labelEn: 'Not reported by country',
    };
  }

  const num = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal));

  if (isNaN(num)) {
    return {
      status: 'missing',
      value: null,
      labelFr: 'Donnée invalide',
      labelEn: 'Invalid data',
    };
  }

  // Check if FAO flagged it as estimate or calculated
  if (typeof rawNode === 'object' && (rawNode.faoEstimate || rawNode.estimated)) {
    return {
      status: 'fao_estimate',
      value: num,
      labelFr: 'Estimation FAO',
      labelEn: 'FAO estimate',
    };
  }

  if (typeof rawNode === 'object' && rawNode.calculated) {
    return {
      status: 'calculated',
      value: num,
      labelFr: 'Calcul agrégé FAO',
      labelEn: 'FAO aggregated calculation',
    };
  }

  return {
    status: 'available',
    value: num,
    labelFr: 'Donnée officielle FAO',
    labelEn: 'Official FAO reported data',
  };
}

export function formatMetricValue(
  value: number | null | undefined,
  unit?: string,
  locale: 'fr' | 'en' = 'fr',
  decimals = 1
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return locale === 'fr' ? 'Non renseigné' : 'Not reported';
  }

  const safeDecimals = typeof decimals === 'number' && !isNaN(decimals) ? decimals : 1;
  const isSmallNonZero = Math.abs(value) < 1 && value !== 0;
  const maxDigits = Math.max(
    0,
    Math.min(20, Math.round(isSmallNonZero && safeDecimals > 0 ? Math.max(safeDecimals, 2) : safeDecimals))
  );
  const minDigits = Math.min(maxDigits, isSmallNonZero ? 2 : 0);

  const formatter = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: minDigits,
  });

  const formatted = formatter.format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}
