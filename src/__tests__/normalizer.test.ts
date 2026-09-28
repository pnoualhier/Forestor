import { describe, it, expect } from 'vitest';
import { fraNormalizer } from '../api/fra/fraNormalizer';
import { FraExplorerApiResponse } from '../api/fra/fraTypes';
import { INDICATORS } from '../data/indicators';

describe('FAO Response Normalization (Section 5 & 28)', () => {
  const sampleFaoResponse: FraExplorerApiResponse = {
    fra: {
      '2025': {
        FRA: {
          extentOfForest: {
            '1990': {
              forestArea: { raw: '14436', odp: true },
            },
            '2025': {
              forestArea: { raw: '17795.00', odp: true },
            },
          },
          forestCharacteristics: {
            '2025': {
              primaryForest: { raw: null }, // Crucial test case: France primary forest is null
              plantedForest: { raw: '2356', calculated: true },
            },
          },
        },
      },
    },
  };

  it('TEST CRUCIAL 3 & 4: preserves units and associates years accurately', () => {
    const observations = fraNormalizer.normalizeObservations(
      sampleFaoResponse,
      ['FRA'],
      INDICATORS,
      '2025'
    );

    const obs1990 = observations.find(
      (o) => o.indicatorId === 'forest_area' && o.year === 1990
    );
    expect(obs1990).toBeDefined();
    expect(obs1990?.value).toBe(14436);
    expect(obs1990?.unit).toBe('1 000 ha');
    expect(obs1990?.year).toBe(1990);

    const obs2025 = observations.find(
      (o) => o.indicatorId === 'forest_area' && o.year === 2025
    );
    expect(obs2025).toBeDefined();
    expect(obs2025?.value).toBe(17795);
    expect(obs2025?.unit).toBe('1 000 ha');
    expect(obs2025?.year).toBe(2025);
  });

  it('preserves null for unreported variables without coercing to zero', () => {
    const observations = fraNormalizer.normalizeObservations(
      sampleFaoResponse,
      ['FRA'],
      INDICATORS,
      '2025'
    );

    const primaryObs = observations.find(
      (o) => o.indicatorId === 'primary_forest' && o.year === 2025
    );
    expect(primaryObs).toBeDefined();
    expect(primaryObs?.value).toBeNull();
    expect(primaryObs?.value).not.toBe(0);
    expect(primaryObs?.status).toBe('not_reported');
  });

  it('extracts country summary with derived metrics properly', () => {
    const summary = fraNormalizer.extractCountrySummary(sampleFaoResponse, 'FRA', '2025', 2025);
    expect(summary.iso3).toBe('FRA');
    expect(summary.forestArea1000Ha).toBe(17795);
    expect(summary.forestAreaMha).toBe(17.8);
    expect(summary.primaryForest1000Ha).toBeNull();
    expect(summary.plantedForest1000Ha).toBe(2356);
    expect(summary.changeSince1990Pct).toBeGreaterThan(0);
  });
});
