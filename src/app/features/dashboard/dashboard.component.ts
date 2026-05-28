import { Component } from '@angular/core';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table/data-table.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { SideDrawerComponent } from '../../shared/ui/side-drawer/side-drawer.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule ,DataTableComponent, CurrencyPipe, ButtonComponent, SideDrawerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  isRequestDrawerOpen: boolean = false;
  totalSpend: number = 2450000;
  pendingRequests: number = 12;
  activeVendors: number = 48;

  // 2. Table Column Configuration (Strictly Typed!)
  tableColumns: TableColumn[] = [
    { key: 'id', header: 'Request ID', type: 'text' },
    { key: 'department', header: 'Department', type: 'text' },
    { key: 'amount', header: 'Amount', type: 'currency' },
    { key: 'status', header: 'Status', type: 'badge' },
    { key: 'action', header: 'Action', type: 'action' }
  ];

  // 3. Dummy Data Array
  recentRequests = [
    { id: 'REQ-2026-001', department: 'Engineering', amount: 125000, status: 'Pending' },
    { id: 'REQ-2026-002', department: 'Marketing', amount: 45000, status: 'Approved' },
    { id: 'REQ-2026-003', department: 'Operations', amount: 89000, status: 'In Transit' },
    { id: 'REQ-2026-004', department: 'HR', amount: 12000, status: 'Rejected' },
    { id: 'REQ-2026-005', department: 'IT', amount: 340000, status: 'Delivered' }
  ];
}
