import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table/data-table.component';
import { DashboardService } from './services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardSummaryModel } from './models/dashboard-summary.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  public readonly auth = inject(AuthService);

  // Signals for state management
  isLoading = signal<boolean>(true);
  summaryData = signal<DashboardSummaryModel | null>(null);

  // Column definitions for PRQ tables
  prqColumns: TableColumn[] = [
    { key: 'prNumber', header: 'Request ID', type: 'text' },
    { key: 'department', header: 'Department', type: 'text' },
    { key: 'totalAmount', header: 'Est. Amount', type: 'currency' },
    { key: 'createdAt', header: 'Created On', type: 'date' },
    { key: 'status', header: 'Status', type: 'badge' }
  ];

  // Column definitions for PO table
  poColumns: TableColumn[] = [
    { key: 'poNumber', header: 'PO Number', type: 'text' },
    { key: 'vendorName', header: 'Vendor Name', type: 'text' },
    { key: 'totalAmount', header: 'Total Amount', type: 'currency' },
    { key: 'createdAt', header: 'Date', type: 'date' },
    { key: 'status', header: 'Status', type: 'badge' }
  ];

  ngOnInit(): void {
    this.fetchDashboardSummary();
  }

  fetchDashboardSummary(): void {
    this.isLoading.set(true);
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summaryData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard summary', err);
        this.isLoading.set(false);
      }
    });
  }
}

