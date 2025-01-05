import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRateResponse } from '../models/exchangeRate';
import { Conversion } from '../models/conversion';
import { HistoricalRatesResponse } from '../models/historicalRates';
import { getDateDaysAgo, getToday } from '../utils/date-utils';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  // Base URL for the API
  private readonly API_URL = 'https://api.frankfurter.app';

  // Signal to store the history of conversions
  private readonly _history = signal<Conversion[]>(this.loadHistory());

  // Signal to store the currently selected currencies
  private readonly _selectedCurrencies = signal<{ from: string; to: string }>({
    from: 'USD',
    to: 'EUR',
  });

  constructor(private http: HttpClient) { }

  // Get the latest exchange rate
  getExchangeRate(from: string, to: string, amount: number): Observable<ExchangeRateResponse> {
    return this.http.get<ExchangeRateResponse>(`${this.API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
  }

  // Get historical exchange rates for the last 7 days
  getHistoricalRates(base: string, target: string): Observable<HistoricalRatesResponse> {
    const today = getToday(); // Fetch today's date
    const lastWeekDate = getDateDaysAgo(7); // Fetch date 7 days ago

    return this.http.get<HistoricalRatesResponse>(`${this.API_URL}/${lastWeekDate}..${today}?from=${base}&to=${target}`);
  }

  // Get available currencies
  getAvailableCurrencies(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.API_URL}/currencies`);
  }

  // Readonly signal for conversion history
  get history(): Signal<Conversion[]> {
    return this._history.asReadonly();
  }

  // Add a new conversion to history
  addConversion(conversion: Conversion): void {
    this._history.update((currentHistory) => {
      const updatedHistory = [...currentHistory, conversion];
      this.saveHistory(updatedHistory);
      return updatedHistory;
    });
  }

  // Readonly signal for selected currencies
  get selectedCurrencyPair(): Signal<{ from: string; to: string }> {
    return this._selectedCurrencies.asReadonly();
  }

  // Update selected currency pair
  setCurrencyPair(from: string, to: string): void {
    this._selectedCurrencies.set({ from, to });
  }

  // Save history to local storage
  private saveHistory(history: Conversion[]): void {
    localStorage.setItem('conversionHistory', JSON.stringify(history));
  }

  // Load history from local storage
  private loadHistory(): Conversion[] {
    const storedHistory = localStorage.getItem('conversionHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  }
}

