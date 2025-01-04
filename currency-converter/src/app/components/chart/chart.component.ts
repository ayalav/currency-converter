import { Component, OnInit } from '@angular/core';
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
export class ChartComponent implements OnInit {

   constructor(private currencyService: CurrencyService) { }
  ngOnInit(): void {
    this.currencyService.getHistoricalRates('USD', 'EUR').subscribe({
      next: (data) => {
        const rates = data.rates;
        const labels = Object.keys(rates);
        const values = labels.map(date => rates[date]['EUR']);
  
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
            label: 'Exchange Rate',
            data: values,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}
