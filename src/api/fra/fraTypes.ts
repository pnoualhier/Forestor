export interface FraNodeValue {
  raw: string | number | null;
  odp?: boolean;
  odpId?: number;
  calculated?: boolean;
  estimated?: boolean;
  faoEstimate?: boolean;
}

export interface FraExplorerApiResponse {
  fra?: {
    [cycle: string]: {
      [countryIso: string]: {
        [tableName: string]: {
          [year: string]: {
            [variableName: string]: FraNodeValue;
          };
        };
      };
    };
  };
  error?: string;
}

export interface FraDescriptionsApiResponse {
  [countryIso: string]: {
    [sectionName: string]: {
      [descriptionType: string]: {
        text?: string;
        dataSources?: Array<{
          reference?: string;
          type?: string;
          year?: string;
          comments?: string;
          variables?: string[];
        }>;
      };
    };
  };
}

export interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
  skipCache?: boolean;
}
