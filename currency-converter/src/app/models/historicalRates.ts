export interface HistoricalRatesResponse {
    base: string; 
    start_date: string; 
    end_date: string; 
    rates: {
      [date: string]: {
        [currency: string]: number; 
      };
    };
  }
  