import { FraExplorerApiResponse, FraDescriptionsApiResponse, FetchOptions } from './fraTypes';

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_RETRIES = 2;

// Uses Vite/Express proxy `/fao-api` by default, or direct URL fallback if configured
const BASE_PROXY_URL = '/fao-api';
const DIRECT_API_URL = 'https://fra-data.fao.org/api';

class FraClient {
  private baseUrls: string[] = [BASE_PROXY_URL, DIRECT_API_URL];

  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timer);
    }
  }

  public async getExplorerData(
    countryISOs: string[],
    tableNames: string[],
    columns?: string[],
    variables?: string[],
    options: FetchOptions = {}
  ): Promise<FraExplorerApiResponse> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const maxRetries = options.retries ?? DEFAULT_RETRIES;

    const params = new URLSearchParams();
    params.set('assessmentName', 'fra');
    countryISOs.forEach(iso => params.append('countryISOs[]', iso));
    tableNames.forEach(tbl => params.append('tableNames[]', tbl));
    if (columns) {
      columns.forEach(col => params.append('columns[]', col));
    }
    if (variables) {
      variables.forEach(v => params.append('variables[]', v));
    }

    const queryString = params.toString();
    let lastError: Error | null = null;

    for (const baseUrl of this.baseUrls) {
      const url = `${baseUrl}/explorer/data?${queryString}`;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await this.fetchWithTimeout(
            url,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
              },
            },
            timeoutMs
          );

          if (response.ok) {
            const data: FraExplorerApiResponse = await response.json();
            return data;
          }

          if (response.status >= 500) {
            // Server error: retry with backoff
            await new Promise(r => setTimeout(r, 400 * Math.pow(2, attempt)));
            continue;
          }

          throw new Error(`FAO API Error ${response.status}: ${response.statusText}`);
        } catch (err: any) {
          lastError = err;
          // If aborted or network error, retry next attempt or next URL
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 400 * Math.pow(2, attempt)));
          }
        }
      }
    }

    throw lastError || new Error('FAO API unreachable after retries.');
  }

  public async getCountryDescriptions(
    countryIso: string,
    cycleName = '2025',
    options: FetchOptions = {}
  ): Promise<FraDescriptionsApiResponse> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const params = new URLSearchParams({
      assessmentName: 'fra',
      cycleName,
      countryIso,
    });

    const queryString = params.toString();
    let lastError: Error | null = null;

    for (const baseUrl of this.baseUrls) {
      const url = `${baseUrl}/cycle-data/descriptions?${queryString}`;
      try {
        const response = await this.fetchWithTimeout(
          url,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          },
          timeoutMs
        );

        if (response.ok) {
          return await response.json();
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error(`Could not fetch descriptions for country ${countryIso}`);
  }
}

export const fraClient = new FraClient();
