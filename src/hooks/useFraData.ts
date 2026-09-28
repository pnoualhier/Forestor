import { useState, useEffect, useCallback } from 'react';
import { fraRepository, RepositoryResult } from '../api/fra/fraRepository';
import { fraNormalizer } from '../api/fra/fraNormalizer';
import { FraExplorerApiResponse } from '../api/fra/fraTypes';
import { CountryForestSummary, ForestObservation } from '../types/observation';
import { INDICATORS } from '../data/indicators';

interface UseFraDataOptions {
  countryISOs: string[];
  tableNames: string[];
  autoFetch?: boolean;
}

export function useFraData({ countryISOs, tableNames, autoFetch = true }: UseFraDataOptions) {
  const [loading, setLoading] = useState<boolean>(autoFetch && countryISOs.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [rawResult, setRawResult] = useState<RepositoryResult<FraExplorerApiResponse> | null>(null);
  const [summaries, setSummaries] = useState<Map<string, CountryForestSummary>>(new Map());
  const [observations, setObservations] = useState<ForestObservation[]>([]);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (countryISOs.length === 0 || tableNames.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fraRepository.getExplorerData(countryISOs, tableNames, forceRefresh);
        setRawResult(result);

        // Normalize observations
        const obs = fraNormalizer.normalizeObservations(result.data, countryISOs, INDICATORS);
        setObservations(obs);

        // Compute summaries for all requested countries
        const sumMap = new Map<string, CountryForestSummary>();
        for (const iso of countryISOs) {
          sumMap.set(iso, fraNormalizer.extractCountrySummary(result.data, iso, '2025', 2025));
        }
        setSummaries(sumMap);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des données FAO FRA.');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countryISOs.join(','), tableNames.join(',')]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData(false);
    }
  }, [autoFetch, fetchData]);

  return {
    loading,
    error,
    summaries,
    observations,
    rawResult,
    fromCache: rawResult?.fromCache ?? false,
    updatedAt: rawResult?.updatedAt ?? null,
    isFallback: rawResult?.isFallback ?? false,
    refetch: () => fetchData(true),
  };
}
