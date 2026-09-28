import { describe, it, expect } from 'vitest';
import { COUNTRIES, COUNTRY_BY_ISO3, COUNTRY_BY_NUMERIC } from '../data/countries';

describe('Country Dataset Integrity (Section 6 & 9)', () => {
  it('contains exactly 236 countries as defined by the official FAO FRA 2025 enum', () => {
    expect(COUNTRIES.length).toBe(236);
  });

  it('maps key countries correctly with French and English names', () => {
    const fra = COUNTRY_BY_ISO3.get('FRA');
    expect(fra).toBeDefined();
    expect(fra?.nameFr).toBe('France');
    expect(fra?.nameEn).toBe('France');
    expect(fra?.region).toBe('Europe');

    const bra = COUNTRY_BY_ISO3.get('BRA');
    expect(bra).toBeDefined();
    expect(bra?.nameFr).toBe('Brésil');
    expect(bra?.nameEn).toBe('Brazil');
    expect(bra?.region).toBe('Americas');
  });

  it('maps numeric IDs to ISO3 for interactive map integration', () => {
    expect(COUNTRY_BY_NUMERIC.get('250')?.iso3).toBe('FRA');
    expect(COUNTRY_BY_NUMERIC.get('076')?.iso3).toBe('BRA');
    expect(COUNTRY_BY_NUMERIC.get('124')?.iso3).toBe('CAN');
  });
});
