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

  constructor(private http: HttpClient) {}

  getExchangeRate(from: string, to: string, amount: number): Observable<ExchangeRateResponse> {
    return this.http.get<ExchangeRateResponse>(`${this.API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
  }

  get history(): Signal<Conversion[]> {
    return this._history;
  }

  addConversion(conversion: Conversion): void {
    this._history.update((currentHistory) => [...currentHistory, conversion]);
  }
}

