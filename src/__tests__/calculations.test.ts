import { describe, it, expect } from 'vitest';
import {
  calculateAbsoluteChange,
  calculateRelativeChange,
  toMha,
  calculateProtectedRatio,
} from '../domain/calculations';

describe('Forestor Calculations & Transparency (Section 26 & 28)', () => {
  it('TEST CRUCIAL 5: A derived calculation must be identified with attribution "Calcul Forestor"', () => {
    const result = calculateAbsoluteChange(1000, 1200, '1 000 ha', 1990, 2025);
    expect(result.isCalculated).toBe(true);
    expect(result.attribution).toBe('Calcul Forestor');
    expect(result.value).toBe(200);
    expect(result.status).toBe('calculated');
  });

  it('relative change returns null if any input is null (never transforms null to 0)', () => {
    const resultWithNull = calculateRelativeChange(null, 1500, 1990, 2025);
    expect(resultWithNull.value).toBeNull();
    expect(resultWithNull.status).toBe('missing');

    const resultWithEndNull = calculateRelativeChange(1200, null, 1990, 2025);
    expect(resultWithEndNull.value).toBeNull();
    expect(resultWithEndNull.status).toBe('missing');
  });

  it('computes correct percentage relative change when values are present', () => {
    // 1000 -> 1250 is +25%
    const res = calculateRelativeChange(1000, 1250, 1990, 2025);
    expect(res.value).toBe(25);
    expect(res.unit).toBe('%');
    expect(res.isCalculated).toBe(true);
  });

  it('converts 1 000 ha to Mha properly', () => {
    expect(toMha(14436)).toBe(14.44);
    expect(toMha(null)).toBeNull();
  });

  it('calculates protected forest ratio correctly and tags as Forestor calculation', () => {
    const res = calculateProtectedRatio(4000, 16000);
    expect(res.value).toBe(25);
    expect(res.unit).toBe('%');
    expect(res.attribution).toBe('Calcul Forestor');
  });
});
