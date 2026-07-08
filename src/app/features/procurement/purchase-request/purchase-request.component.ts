import { Component } from '@angular/core';
import { DataTableComponent, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { PrqServiceService } from '../../services/prq-service.service';

@Component({
  selector: 'app-purchase-request',
  imports: [CommonModule, DataTableComponent],
  templateUrl: './purchase-request.component.html',
  styleUrl: './purchase-request.component.css'
})
export class PurchaseRequestComponent {

  constructor(private prqService: PrqServiceService) {}

  prqData: any[] = []; 
  
  ngOnInit() {
    this.loadData();
  }

  prqColumns: TableColumn[] = [
    { key: 'prNumber', header: 'Request ID', type: 'text' },
    { key: 'department', header: 'Department', type: 'text' },
    { key: 'totalAmount', header: 'Est. Amount', type: 'currency' },
    { key: 'createdAt', header: 'Created On', type: 'date' },
    { key: 'status', header: 'Status', type: 'badge' },
    { 
      key: 'actions', 
      header: 'Actions', 
      type: 'action',
      actions: [
        { label: 'View', actionKey: 'VIEW' },
        { label: 'Approve', actionKey: 'APPROVE', colorClass: 'text-green-600 hover:text-green-800' }
      ]
    }
  ];

  // prqData = [
  //   { reqId: 'PRQ-2024-001', department: 'Engineering', item: 'MacBook Pro M3 Max', amount: 320000, status: 'Pending' },
  //   { reqId: 'PRQ-2024-002', department: 'Marketing', item: 'Figma Enterprise License', amount: 85000, status: 'Approved' },
  //   { reqId: 'PRQ-2024-003', department: 'Operations', item: 'Office Chairs (x10)', amount: 150000, status: 'Delivered' },
  //   { reqId: 'PRQ-2024-004', department: 'Sales', item: 'Client Dinner Expense', amount: 45000, status: 'Rejected' },
  // ];

  // 3. Handle the Action Clicks
  handleTableAction(event: { action: string; row: any }) {
    if (event.action === 'VIEW') {
      console.log('Opening details for:', event.row.reqId);
    } else if (event.action === 'APPROVE') {
      console.log('Approving request:', event.row.reqId);
    }
  }


  loadData() {
    this.prqService.getAllRequests().subscribe({
      next: (response: any) => {this.prqData = response.content, console.log('Fetched data:', response);},
      error: (err) => console.error('Failed to fetch data', err)
    });
  }

  handlePageChange(event: any) {
    console.log('Page changed to:', event);
  }

}
