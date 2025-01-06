import { ChangeDetectionStrategy, Component, OnInit, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Conversion } from '../../models/conversion';
import { CurrencyService } from '../../services/currency.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ExchangeRateResponse } from '../../models/exchangeRate';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConverterComponent implements OnInit {
  form = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    from: new FormControl<string>('USD', [Validators.required]),
    to: new FormControl<string>('EUR', [Validators.required]),
  });

  result = signal<number | null>(null); // Signal to store the conversion result
  currencies = signal<string[]>([]);  // Signal to store the list of available currencies

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  // Fetch the list of available currencies from the API on component initialization
  private loadCurrencies(): void {
    this.currencyService.getAvailableCurrencies().subscribe({
      next: (currencies) => this.currencies.set(Object.keys(currencies)), // Update the currencies signal
      error: (err) => console.error('Failed to fetch currencies:', err),
    });
  }

  // Convert the amount from one currency to another
  convert() {
    if (!this.form.valid) {
      console.error('Form is invalid');
      return;
    }

    const { amount, from, to } = this.form.value as { amount: number; from: string; to: string };

    this.currencyService.setCurrencyPair(from, to); // Update selected currency pair in the service

    // Fetch exchange rate and handle the response
    this.currencyService.getExchangeRate(from, to, amount).subscribe({
      next: (res) => this.handleApiResponse(res, amount, from, to),
      error: (err) => console.error('Failed to fetch exchange rate:', err)
    });
  }

// Handle the API response and update the result
  private handleApiResponse(res: ExchangeRateResponse, amount: number, from: string, to: string) {
    if (!res.rates || !res.rates[to]) {
      console.error(`No exchange rate available for currency: ${to}`);
      return;
    }

    const result = res.rates[to];
    if (result !== null) {
      this.result.set(result); // Update the result signal
      this.currencyService.addConversion({ from, to, amount, result });  // Add the conversion to history
    }
  }
}
