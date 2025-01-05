import { ChangeDetectionStrategy, Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CurrencyService } from '../../services/currency.service';
import { formatDate } from '@angular/common';

// Register required Chart.js modules
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private currencyService: CurrencyService) {
    // Automatically update the chart when the selected currency pair changes
    effect(() => {
      const pair = this.currencyService.selectedCurrencyPair();
      this.loadChart(pair.from, pair.to);
    });
  }

  // Load historical data and create the chart
  private loadChart(base: string, target: string): void {
    this.currencyService.getHistoricalRates(base, target).subscribe({
      next: (data) => {
        const rates = data.rates;

        // Generate date labels in dd/MM/yyyy format
        const originalDates = Object.keys(rates);
        const labels = originalDates.map((date) =>
          formatDate(new Date(date), 'dd/MM/yyyy', 'en-US')
        );

        // Extract values for the target currency
        const values = originalDates.map((date) => rates[date]?.[target] ?? 0);

        this.createChart(labels, values);
      },
      error: (err) => console.error('Failed to load historical data:', err),
    });
  }

  // Create the chart using Chart.js
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