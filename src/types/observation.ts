import { QualityStatus } from './indicator';

export interface ForestObservation {
  countryIso3: string;
  indicatorId: string;
  year: number | string;
  value: number | null;
  unit: string;
  status: QualityStatus;
  isCalculated: boolean;
  source: string;
  raw?: any;
  updatedAt?: string;
}

export interface CountryTimeSeries {
  countryIso3: string;
  indicatorId: string;
  points: {
    year: number | string;
    value: number | null;
    status: QualityStatus;
  }[];
}

export interface CountryForestSummary {
  iso3: string;
  year: number;
  forestArea1000Ha: number | null;
  forestAreaMha: number | null;
  forestProportionLand: number | null;
  forestNetChangeAnnual: number | null;
  primaryForest1000Ha: number | null;
  plantedForest1000Ha: number | null;
  naturalForest1000Ha: number | null;
  protectedForest1000Ha: number | null;
  carbonTotalMt: number | null;
  growingStockMm3: number | null;
  publicOwnership1000Ha: number | null;
  privateOwnership1000Ha: number | null;
  changeSince1990Pct: number | null;
  changeSince1990Abs1000Ha: number | null;
}
