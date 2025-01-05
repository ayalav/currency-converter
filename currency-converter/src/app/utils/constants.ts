// src/app/utils/constants.ts
export const LOCAL_STORAGE_KEYS = {
    HISTORY: 'conversionHistory',
    AVAILABLE_CURRENCIES: 'availableCurrencies',
  };
  
  export const API_URLS = {
    BASE: 'https://api.frankfurter.app',
    LATEST: (amount: number, from: string, to: string) =>
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
    HISTORICAL: (start: string, end: string, base: string, target: string) =>
      `https://api.frankfurter.app/${start}..${end}?from=${base}&to=${target}`,
  };
  