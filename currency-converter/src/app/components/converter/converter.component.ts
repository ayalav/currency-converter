import { Component, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    amount: new FormControl(0),
    from: new FormControl('USD'),
    to: new FormControl('EUR'),
  });

  result = signal<number | null>(null);
  history = signal<Conversion[]>([]);

  constructor(private currencyService: CurrencyService) { }

  convert() {
    const { amount, from, to } = this.form.value;
    if (amount && from && to) {
      this.currencyService.getExchangeRate(from, to, amount).subscribe({
        next: (res) => {
          const result = res.rates[to];
          if (result !== null) {
            this.result.set(result);
            this.updateHistory(amount, from, to, result);
          }
        },
        error: (err) => {
          console.error('Failed to fetch exchange rate:', err);
        },
      });
    }
  }

  private updateHistory(amount: number, from: string, to: string, result: number) {
    this.history.update((hist) => [
      ...hist,
      { from, to, amount, result },
    ]);
  }
}
