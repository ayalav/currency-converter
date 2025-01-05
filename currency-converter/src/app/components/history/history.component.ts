import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class HistoryComponent {
  displayedColumns: string[] = ['from', 'to', 'amount', 'result'];
  
  constructor(public currencyService: CurrencyService) {}
}
