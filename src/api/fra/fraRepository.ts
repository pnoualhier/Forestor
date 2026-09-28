import { fraClient } from './fraClient';
import { FraExplorerApiResponse, FraDescriptionsApiResponse } from './fraTypes';
import { FAO_BASELINE_DATA } from '../../data/baselineData';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_PREFIX = 'forestor_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface RepositoryResult<T> {
  data: T;
  fromCache: boolean;
  updatedAt: string;
  isFallback: boolean;
}

class FraRepository {
  private memoryCache = new Map<string, CacheEntry<any>>();

  private getCacheKey(prefix: string, params: Record<string, any>): string {
    return `${prefix}:${JSON.stringify(params, Object.keys(params).sort())}`;
  }

  private readStorage<T>(key: string): CacheEntry<T> | null {
    try {
      const item = localStorage.getItem(CACHE_PREFIX + key);
      if (!item) return null;
      return JSON.parse(item) as CacheEntry<T>;
    } catch {
      return null;
    }
  }

  private writeStorage<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // Storage quota or private browsing mode - safely ignore
    }
  }

  /**
   * Fetches explorer data for countries and tables with caching & offline fallback
   */
  public async getExplorerData(
    countryISOs: string[],
    tableNames: string[],
    forceRefresh = false
  ): Promise<RepositoryResult<FraExplorerApiResponse>> {
    const cacheKey = this.getCacheKey('explorer', { countryISOs: [...countryISOs].sort(), tableNames: [...tableNames].sort() });

    // 1. Check in-memory and localStorage cache
    if (!forceRefresh) {
      const mem = this.memoryCache.get(cacheKey);
      if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
        return {
          data: mem.data,
          fromCache: true,
          updatedAt: new Date(mem.timestamp).toISOString(),
          isFallback: false,
        };
      }

      const stored = this.readStorage<FraExplorerApiResponse>(cacheKey);
      if (stored && Date.now() - stored.timestamp < CACHE_TTL_MS) {
        this.memoryCache.set(cacheKey, stored);
        return {
          data: stored.data,
          fromCache: true,
          updatedAt: new Date(stored.timestamp).toISOString(),
          isFallback: false,
        };
      }
    }

    // 2. Try fetching from live FAO API
    try {
      const liveData = await fraClient.getExplorerData(countryISOs, tableNames);
      if (liveData && liveData.fra) {
        const entry: CacheEntry<FraExplorerApiResponse> = { data: liveData, timestamp: Date.now() };
        this.memoryCache.set(cacheKey, entry);
        this.writeStorage(cacheKey, liveData);
        return {
          data: liveData,
          fromCache: false,
          updatedAt: new Date().toISOString(),
          isFallback: false,
        };
      }
    } catch (err) {
      console.warn('FAO API live query failed, falling back to cache/baseline:', err);
    }

    // 3. If live query failed, try any stale cache entry
    const stale = this.readStorage<FraExplorerApiResponse>(cacheKey);
    if (stale) {
      return {
        data: stale.data,
        fromCache: true,
        updatedAt: new Date(stale.timestamp).toISOString(),
        isFallback: false,
      };
    }

    // 4. Fallback to certified baseline data for requested countries
    const fallbackResponse: FraExplorerApiResponse = {
      fra: {
        '2025': {},
      },
    };

    for (const iso of countryISOs) {
      if (FAO_BASELINE_DATA[iso]) {
        fallbackResponse.fra!['2025'][iso] = {};
        for (const tbl of tableNames) {
          if (FAO_BASELINE_DATA[iso][tbl]) {
            fallbackResponse.fra!['2025'][iso][tbl] = FAO_BASELINE_DATA[iso][tbl];
          }
        }
      }
    }

    return {
      data: fallbackResponse,
      fromCache: true,
      updatedAt: '2025-01-01T00:00:00.000Z',
      isFallback: true,
    };
  }

  /**
   * Fetches descriptive metadata for a country with caching
   */
  public async getCountryDescriptions(
    countryIso: string,
    forceRefresh = false
  ): Promise<RepositoryResult<FraDescriptionsApiResponse>> {
    const cacheKey = `desc_${countryIso}`;

    if (!forceRefresh) {
      const stored = this.readStorage<FraDescriptionsApiResponse>(cacheKey);
      if (stored) {
        return {
          data: stored.data,
          fromCache: true,
          updatedAt: new Date(stored.timestamp).toISOString(),
          isFallback: false,
        };
      }
    }

    try {
      const data = await fraClient.getCountryDescriptions(countryIso);
      this.writeStorage(cacheKey, data);
      return {
        data,
        fromCache: false,
        updatedAt: new Date().toISOString(),
        isFallback: false,
      };
    } catch {
      return {
        data: {},
        fromCache: true,
        updatedAt: new Date().toISOString(),
        isFallback: true,
      };
    }
  }

  /**
   * Clears local cache for fresh data reload
   */
  public clearCache(): void {
    this.memoryCache.clear();
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
  }
}

export const fraRepository = new FraRepository();
