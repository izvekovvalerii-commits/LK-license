import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresService } from '../../services/stores';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-stores',
  imports: [CommonModule],
  templateUrl: './stores.html',
  styleUrl: './stores.css'
})
export class StoresComponent implements OnInit {
  stores: Store[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private storesService: StoresService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadStores();
  }

  loadStores() {
    console.log('Loading stores...');
    this.loading = true;
    this.error = null;

    this.storesService.getStores().subscribe({
      next: (data) => {
        console.log('Stores loaded successfully:', data);
        this.stores = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.error('Error loading stores:', err);
        this.error = `Ошибка загрузки данных: ${err.message || err.status || 'Неизвестная ошибка'}`;
        this.loading = false;
        this.cdr.detectChanges(); // Force UI update
      },
      complete: () => {
        console.log('Stores loading completed');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Planning': return 'status-planning';
      case 'Renovation': return 'status-renovation';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Active': return 'Активный';
      case 'Planning': return 'Планируется';
      case 'Renovation': return 'Ремонт';
      default: return status;
    }
  }
}
