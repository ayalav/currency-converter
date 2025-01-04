export interface ExchangeRateResponse {
    amount: number;
    base: string;
    date: string;
    rates: {
      [currency: string]: number;
    };
  }