import { ChangeDetectionStrategy, Component, computed, Signal, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CurrencyService } from '../../services/currency.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Conversion } from '../../models/conversion';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {

  // Signal for total history data
  history!: Signal<Conversion[]>;

  // Pagination settings
  totalRecords = computed(() => this.history().length); // Use computed for reactivity
  pageSize = signal(10);
  currentPage = signal(0);

  displayedColumns = ['from', 'to', 'amount', 'result'];
  
 // Derived signal for paginated data
 currentPageData = computed(() => {
  const start = this.currentPage() * this.pageSize();
  const end = start + this.pageSize();
  return this.history().slice(start, end);
});
  
  constructor(public currencyService: CurrencyService) {
    this.history = this.currencyService.history; 
   }

   onPageChange({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) {
    this.pageSize.set(pageSize); // Update the page size
    this.currentPage.set(pageIndex); // Update the current page
  }
}