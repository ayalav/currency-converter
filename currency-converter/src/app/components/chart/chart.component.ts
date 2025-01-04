import { Component, effect, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CurrencyService } from '../../services/currency.service';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {

  constructor(private currencyService: CurrencyService) {
    effect(() => {
      const pair = this.currencyService.selectedCurrencyPair(); // קריאת ערך ה-Signal
      this.loadChart(pair.from, pair.to); // טוען את הגרף
    });
  }

  private loadChart(base: string, target: string): void {
    // קריאת נתונים היסטוריים והצגת גרף
    this.currencyService.getHistoricalRates(base, target).subscribe({
      next: (data) => {
        const rates = data.rates;
        const labels = Object.keys(rates);
        const values = labels.map((date) => rates[date][target]);

        this.createChart(labels, values);
      },
      error: (err) => console.error('Failed to load historical data:', err),
    });
  }

  private createChart(labels: string[], values: number[]): void {
    new Chart('chartCanvas', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Exchange Rate (${labels[0]} - ${labels[labels.length - 1]})`,
            data: values,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}