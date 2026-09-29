import { describe, it, expect } from 'vitest';
import { evaluateQualityStatus, formatMetricValue } from '../domain/quality';

describe('Data Quality and Missing Values Rules (Section 15 & 28)', () => {
  it('TEST CRUCIAL 1: null != 0 — A missing value must NEVER be converted to 0', () => {
    const missingNode = { raw: null };
    const result = evaluateQualityStatus(missingNode);

    expect(result.value).toBeNull();
    expect(result.value).not.toBe(0);
    expect(result.status).toBe('not_reported');
  });

  it('TEST CRUCIAL 2: Undefined node is evaluated as missing and not zero', () => {
    const result = evaluateQualityStatus(undefined);
    expect(result.value).toBeNull();
    expect(result.value).not.toBe(0);
    expect(result.status).toBe('missing');
  });

  it('parses valid numeric values properly without distortion', () => {
    const validNode = { raw: '17795.00' };
    const result = evaluateQualityStatus(validNode);

    expect(result.value).toBe(17795);
    expect(result.status).toBe('available');
  });

  it('correctly flags FAO estimate nodes', () => {
    const estimateNode = { raw: '2350', faoEstimate: true };
    const result = evaluateQualityStatus(estimateNode);

    expect(result.value).toBe(2350);
    expect(result.status).toBe('fao_estimate');
  });

  it('formats metric values properly and outputs non-reported label on null', () => {
    expect(formatMetricValue(null, 'ha', 'fr')).toBe('Non renseigné');
    expect(formatMetricValue(null, 'ha', 'en')).toBe('Not reported');
    expect(formatMetricValue(1234.5, 'kha', 'fr')).toBe('1\u202f234,5 kha');
  });

  it('handles small fractional numbers and various decimal arguments without throwing RangeError', () => {
    expect(() => formatMetricValue(0.42, '%', 'fr', 1)).not.toThrow();
    expect(() => formatMetricValue(0.42, '%', 'fr', 0)).not.toThrow();
    expect(() => formatMetricValue(-0.05, '%', 'fr', 1)).not.toThrow();
    expect(() => formatMetricValue(0.001, 'Mt', 'en', 3)).not.toThrow();
    expect(formatMetricValue(0.42, '%', 'fr', 1)).toBe('0,42 %');
    expect(formatMetricValue(0.42, '%', 'fr', 0)).toBe('0 %');
  });
});
