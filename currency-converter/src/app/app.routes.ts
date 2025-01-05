import { Routes } from '@angular/router';
import { ConverterComponent } from './components/converter/converter.component';
import { HistoryComponent } from './components/history/history.component';
import { ChartComponent } from './components/chart/chart.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/converter/converter.component').then((m) => m.ConverterComponent),          
    },
    {
        path: 'history',
        loadComponent: () =>
            import('./components/history/history.component').then((m) => m.HistoryComponent),
    },
    {
        path: 'chart',
        loadComponent: () =>
            import('./components/chart/chart.component').then((m) => m.ChartComponent),
    },
];
