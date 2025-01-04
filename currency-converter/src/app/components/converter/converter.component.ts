import { Component, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Conversion } from '../../models/conversion';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent {
  form = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    from: new FormControl<string>('USD', [Validators.required]),
    to: new FormControl<string>('EUR', [Validators.required]),
  });

  result = signal<number | null>(null);
  history = signal<Conversion[]>([]);

  constructor(private currencyService: CurrencyService) { }

  convert() {
    if (!this.form.valid) {
      console.error('Form is invalid');
      return;
    }
  
    const { amount, from, to } = this.form.value;
  
    if (!amount || !from || !to) {
      console.error('Invalid form values:', { amount, from, to });
      return;
    }
  
    this.currencyService.getExchangeRate(from, to, amount).subscribe({
      next: (res) => this.handleApiResponse(res, amount, from, to),
      error: (err) => console.error('Failed to fetch exchange rate:', err)
    });
  }

  private handleApiResponse(res: any, amount: number, from: string, to: string) {
    if (!res.rates || !res.rates[to]) {
      console.error(`No exchange rate available for currency: ${to}`);
      return;
    }
  
    const result = res.rates[to];
    if (result !== null) {
      this.result.set(result);
      this.updateHistory(amount, from, to, result);
    }
  }

  private updateHistory(amount: number, from: string, to: string, result: number) {
    this.history.update((hist) => [
      ...hist,
      { from, to, amount, result },
    ]);
  }
}
