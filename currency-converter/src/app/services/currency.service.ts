import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private readonly API_URL = 'https://api.frankfurter.app';

  constructor(private http: HttpClient) {}

  getExchangeRate(from: string, to: string, amount: number): Observable<any> {
    return this.http.get(`${this.API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
  }
}

