import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRateResponse } from '../models/exchangeRate';
import { Conversion } from '../models/conversion';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private readonly API_URL = 'https://api.frankfurter.app';
  private readonly _history = signal<Conversion[]>([]);
  private readonly _selectedCurrencies = signal<{ from: string; to: string }>({
    from: 'USD',
    to: 'EUR',
  });

  constructor(private http: HttpClient) {}

  getExchangeRate(from: string, to: string, amount: number): Observable<ExchangeRateResponse> {
    return this.http.get<ExchangeRateResponse>(`${this.API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
  }

  getHistoricalRates(base: string, target: string): Observable<any> {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekDate = lastWeek.toISOString().split('T')[0];
  
    return this.http.get(`${this.API_URL}/${lastWeekDate}..${today}?from=${base}&to=${target}`);
  }  

  get history(): Signal<Conversion[]> {
    return this._history;
  }

  addConversion(conversion: Conversion): void {
    this._history.update((currentHistory) => [...currentHistory, conversion]);
  }

  get selectedCurrencyPair(): Signal<{ from: string; to: string }> {
    return this._selectedCurrencies;
  }

  setCurrencyPair(from: string, to: string): void {
    this._selectedCurrencies.set({ from, to });
  }  
}

