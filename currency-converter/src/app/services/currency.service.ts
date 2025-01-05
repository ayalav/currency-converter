import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ExchangeRateResponse } from '../models/exchangeRate';
import { Conversion } from '../models/conversion';
import { HistoricalRatesResponse } from '../models/historicalRates';
import { getDateDaysAgo, getToday } from '../utils/date-utils';
import { StorageService } from './storage.service';
import { API_URLS, LOCAL_STORAGE_KEYS } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  // Signal to store the history of conversions
  private _history = signal<Conversion[]>([]);

  // Signal to store the currently selected currencies
  private readonly _selectedCurrencies = signal<{ from: string; to: string }>({
    from: 'USD',
    to: 'EUR',
  });

  constructor(private http: HttpClient, private storageService: StorageService) {
    const savedHistory = this.storageService.load<Conversion[]>(LOCAL_STORAGE_KEYS.HISTORY);
    this._history.set(savedHistory || []);
  }

  // Get available currencies
  getAvailableCurrencies(): Observable<{ [key: string]: string }> {
    const cachedCurrencies = this.storageService.load<{ [key: string]: string }>(
      LOCAL_STORAGE_KEYS.AVAILABLE_CURRENCIES
    );
    if (cachedCurrencies) {
      return new Observable((observer) => {
        observer.next(cachedCurrencies);
        observer.complete();
      });
    }

    return this.http.get<{ [key: string]: string }>(`${API_URLS.BASE}/currencies`).pipe(
      tap((currencies) => {
        this.storageService.save(LOCAL_STORAGE_KEYS.AVAILABLE_CURRENCIES, currencies);
      })
    );
  }

  // Get the latest exchange rate
  getExchangeRate(from: string, to: string, amount: number): Observable<ExchangeRateResponse> {
    return this.http.get<ExchangeRateResponse>(
      API_URLS.LATEST(amount, from, to)
    );
  }

  // Get historical exchange rates for the last 7 days
  getHistoricalRates(base: string, target: string): Observable<HistoricalRatesResponse> {
    const today = getToday();
    const lastWeekDate = getDateDaysAgo(7);

    return this.http.get<HistoricalRatesResponse>(
      API_URLS.HISTORICAL(lastWeekDate, today, base, target)
    );
  }

  // Readonly signal for conversion history
  get history(): Signal<Conversion[]> {
    return this._history.asReadonly();
  }

  // Add a new conversion to history
  addConversion(conversion: Conversion): void {
    this._history.update((currentHistory) => {
      const updatedHistory = [...currentHistory, conversion];
      this.storageService.save(LOCAL_STORAGE_KEYS.HISTORY, updatedHistory);
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
}

