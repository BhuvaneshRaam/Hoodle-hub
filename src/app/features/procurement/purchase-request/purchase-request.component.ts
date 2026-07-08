import { Component } from '@angular/core';
import { DataTableComponent, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { PrqServiceService } from '../../services/prq-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { SideDrawerComponent } from '../../../shared/ui/side-drawer/side-drawer.component';

@Component({
  selector: 'app-purchase-request',
  imports: [CommonModule, DataTableComponent, FormsModule, SideDrawerComponent],
  templateUrl: './purchase-request.component.html',
  styleUrl: './purchase-request.component.css'
})
export class PurchaseRequestComponent {

  constructor(private prqService: PrqServiceService) { }

  prqData: any[] = [];
  isDrawerOpen: boolean = false;
  isSubmitting: boolean = false;
  isSuccess: boolean = false;

  currentPage: number = 0;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  ngOnInit() {
    this.loadData();
  }

  newRequest = {
    department: '',
    remarks: '',
    items: [
      { itemName: '', description: '', quantity: 1, unitPrice: null as any }
    ]
  };

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



  // 3. Handle the Action Clicks
  handleTableAction(event: { action: string; row: any }) {
    if (event.action === 'VIEW') {
      console.log('Opening details for:', event.row.reqId);
    } else if (event.action === 'APPROVE') {
      console.log('Approving request:', event.row.reqId);
    }
  }


  loadData() {
    this.prqService.getAllRequests(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.prqData = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        console.log('Fetched data:', response);
      },
      error: (err) => console.error('Failed to fetch data', err)
    });
  }

  handlePageChange(event: number) {
    this.currentPage = event;
    this.loadData();
  }


  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer(form?: NgForm) {
    this.isDrawerOpen = false;
    this.resetForm(form);
  }

  addItem() {
    this.newRequest.items.push({ itemName: '', description: '', quantity: 1, unitPrice: null });
  }

  removeItem(index: number) {
    if (this.newRequest.items.length > 1) {
      this.newRequest.items.splice(index, 1);
    }
  }

  get requestTotal(): number {
    return this.newRequest.items.reduce((total, item) => {
      return total + ((item.quantity || 0) * (item.unitPrice || 0));
    }, 0);
  }

  submitRequest(form: NgForm) {
    if (form.invalid) return;
    this.isSubmitting = true;

    this.prqService.createRequest(this.newRequest).subscribe({
      next: () => {
        console.log('Successfully created!');
        this.isSubmitting = false;
        this.isSuccess = true;

        setTimeout(() => {
          this.closeDrawer(form);
          this.loadData();
          this.isSuccess = false; // Reset for next time
        }, 600);
      },
      error: (err) => {
        console.error('Submission failed', err);
        this.isSubmitting = false;
      }
    });
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
    this.newRequest = {
      department: '',
      remarks: '',
      items: [{ itemName: '', description: '', quantity: 1, unitPrice: null as any }]
    };
  }
}
