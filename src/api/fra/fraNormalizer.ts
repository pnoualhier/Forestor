import { FraExplorerApiResponse, FraNodeValue } from './fraTypes';
import { ForestIndicator } from '../../types/indicator';
import { ForestObservation, CountryForestSummary } from '../../types/observation';
import { evaluateQualityStatus } from '../../domain/quality';
import { calculateAbsoluteChange, calculateRelativeChange, toMha } from '../../domain/calculations';

export class FraNormalizer {
  /**
   * Normalizes a raw explorer API response into typed observations for specific indicators
   */
  public normalizeObservations(
    response: FraExplorerApiResponse,
    countryISOs: string[],
    indicators: ForestIndicator[],
    cycle = '2025'
  ): ForestObservation[] {
    const results: ForestObservation[] = [];
    const cycleData = response.fra?.[cycle];

    if (!cycleData) return results;

    for (const iso of countryISOs) {
      const countryData = cycleData[iso];
      if (!countryData) continue;

      for (const indicator of indicators) {
        const tableData = countryData[indicator.tableName];
        if (!tableData) continue;

        for (const [yearStr, yearObj] of Object.entries(tableData)) {
          const node: FraNodeValue | undefined = yearObj?.[indicator.variableName];
          const quality = evaluateQualityStatus(node);

          results.push({
            countryIso3: iso,
            indicatorId: indicator.id,
            year: isNaN(Number(yearStr)) ? yearStr : Number(yearStr),
            value: quality.value,
            unit: indicator.unit,
            status: quality.status,
            isCalculated: false,
            source: 'FAO — Global Forest Resources Assessment (FRA 2025)',
            raw: node,
          });
        }
      }
    }

    return results;
  }

  /**
   * Extracts a structured country summary for quick dashboard and country sheets
   */
  public extractCountrySummary(
    response: FraExplorerApiResponse,
    iso3: string,
    cycle = '2025',
    targetYear = 2025
  ): CountryForestSummary {
    const countryData = response.fra?.[cycle]?.[iso3] || {};

    const getVal = (table: string, year: number | string, variable: string): number | null => {
      const node = countryData[table]?.[String(year)]?.[variable];
      const evaluated = evaluateQualityStatus(node);
      return evaluated.value;
    };

    const forestArea1000Ha = getVal('extentOfForest', targetYear, 'forestArea');
    const forestArea1990 = getVal('extentOfForest', 1990, 'forestArea');
    const forestProportionLand = getVal('sustainableDevelopment15_1_1', targetYear, 'forestAreaProportionLandArea2015');
    const forestNetChangeAnnual = getVal('forestAreaChange', '2020-2025', 'forestAreaNetChangeFrom1a') ??
                                  getVal('forestAreaChange', '2015-2020', 'forestAreaNetChangeFrom1a');
    const primaryForest1000Ha = getVal('forestCharacteristics', targetYear, 'primaryForest');
    const plantedForest1000Ha = getVal('forestCharacteristics', targetYear, 'plantedForest');
    const naturalForest1000Ha = getVal('forestCharacteristics', targetYear, 'naturalForestArea');
    const protectedForest1000Ha = getVal('forestAreaWithinProtectedAreas', targetYear, 'forest_area_within_protected_areas');
    const growingStockMm3 = getVal('growingStockTotal', targetYear, 'forest');

    // Carbon
    const cAbove = getVal('carbonStockTotal', targetYear, 'carbon_forest_above_ground');
    const cBelow = getVal('carbonStockTotal', targetYear, 'carbon_forest_below_ground');
    const cSoil = getVal('carbonStockTotal', targetYear, 'carbon_forest_soil');
    let carbonTotalMt: number | null = null;
    if (cAbove !== null || cBelow !== null || cSoil !== null) {
      carbonTotalMt = Number(((cAbove || 0) + (cBelow || 0) + (cSoil || 0)).toFixed(1));
    }

    // Ownership (latest is typically 2020)
    const publicOwnership1000Ha = getVal('forestOwnership', 2020, 'public_ownership');
    const privateOwnership1000Ha = getVal('forestOwnership', 2020, 'private_ownership');

    // Change since 1990 (Forestor calculations)
    const relChange = calculateRelativeChange(forestArea1990, forestArea1000Ha, 1990, targetYear);
    const absChange = calculateAbsoluteChange(forestArea1990, forestArea1000Ha, '1 000 ha', 1990, targetYear);

    return {
      iso3,
      year: targetYear,
      forestArea1000Ha,
      forestAreaMha: toMha(forestArea1000Ha),
      forestProportionLand,
      forestNetChangeAnnual,
      primaryForest1000Ha,
      plantedForest1000Ha,
      naturalForest1000Ha,
      protectedForest1000Ha,
      carbonTotalMt,
      growingStockMm3,
      publicOwnership1000Ha,
      privateOwnership1000Ha,
      changeSince1990Pct: relChange.value,
      changeSince1990Abs1000Ha: absChange.value,
    };
  }
}

export const fraNormalizer = new FraNormalizer();
