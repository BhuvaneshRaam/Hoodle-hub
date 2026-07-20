import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { SideDrawerComponent } from '../../../shared/ui/side-drawer/side-drawer.component';
import { PoServiceService } from '../../services/po-service.service';

@Component({
  selector: 'app-purchase-order',
  imports: [CommonModule, FormsModule, DataTableComponent, SideDrawerComponent],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
})
export class PurchaseOrderComponent implements OnInit {
  poData: any[] = [];
  currentPage: number = 0;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  isDrawerOpen: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  isSaving: boolean = false;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  selectedPo: any = {
    id: '',
    poNumber: '',
    vendorName: '',
    vendorEmail: '',
    negotiatedPrice: null as number | null,
    totalAmount: 0,
    status: '',
    items: []
  };

  poColumns: TableColumn[] = [
    { key: 'poNumber', header: 'PO Number', type: 'text' },
    { key: 'vendorName', header: 'Vendor Name', type: 'text' },
    { key: 'totalAmount', header: 'Total Amount', type: 'currency' },
    { key: 'createdAt', header: 'Date', type: 'date' },
    { key: 'status', header: 'Status', type: 'badge' },
    {
      key: 'actions',
      header: 'Actions',
      type: 'action',
      actions: [
        {
          label: 'View',
          actionKey: 'VIEW',
          colorClass: 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
        },
        {
          label: 'Edit',
          actionKey: 'EDIT',
          colorClass: 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50 shadow-sm',
          showIf: (row) => row.status === 'DRAFT'
        },
        {
          label: 'Issue',
          actionKey: 'ISSUE',
          colorClass: 'text-brand-700 bg-brand-50 border-brand-200 hover:bg-brand-100',
          showIf: (row) => row.status === 'DRAFT'
        }
      ]
    }
  ];

  constructor(
    private poService: PoServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.poService.getAllOrders(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.poData = response.content || [];
        this.totalPages = response.totalPages || 1;
        this.totalElements = response.totalElements || 0;
      },
      error: (err) => console.error('Failed to fetch PO list', err)
    });
  }

  handlePageChange(event: number): void {
    this.currentPage = event;
    this.loadData();
  }

  showSuccessToast(message: string): void {
    this.toastType = 'success';
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }

  showErrorToast(message: string): void {
    this.toastType = 'error';
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3500);
  }

  handleTableAction(event: { action: string; row: any }): void {
    const poId = event.row.id;

    if (event.action === 'VIEW') {
      this.isViewMode = true;
      this.isEditMode = false;
      this.fetchPoDetails(poId);
    } else if (event.action === 'EDIT') {
      this.isViewMode = false;
      this.isEditMode = true;
      this.fetchPoDetails(poId);
    } else if (event.action === 'ISSUE') {
      this.poService.issueOrder(poId).subscribe({
        next: () => {
          this.showSuccessToast('Purchase Order issued successfully!');
          this.loadData();
        },
        error: (err) => {
          console.error('Failed to issue PO', err);
          this.showErrorToast('Failed to issue Purchase Order. Please try again.');
        }
      });
    }
  }

  fetchPoDetails(poId: string): void {
    this.poService.getOrderById(poId).subscribe({
      next: (fullPo: any) => {
        this.selectedPo = {
          id: fullPo.id,
          poNumber: fullPo.poNumber,
          vendorName: fullPo.vendorName || '',
          vendorEmail: fullPo.vendorEmail || '',
          negotiatedPrice: fullPo.negotiatedPrice ?? null,
          totalAmount: fullPo.totalAmount,
          status: fullPo.status,
          items: fullPo.items || []
        };
        this.isDrawerOpen = true;
      },
      error: (err) => {
        console.error('Failed to fetch PO details', err);
        this.showErrorToast('Failed to load order details. Please try again.');
        this.isDrawerOpen = false;
        this.isEditMode = false;
        this.isViewMode = false;
      }
    });
  }

  saveOrder(form: NgForm): void {
    if (form.invalid) return;
    this.isSaving = true;

    const payload = {
      vendorName: this.selectedPo.vendorName,
      vendorEmail: this.selectedPo.vendorEmail,
      negotiatedPrice: this.selectedPo.negotiatedPrice
    };

    this.poService.updateOrder(this.selectedPo.id, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.isDrawerOpen = false;
        this.showSuccessToast('Purchase Order updated successfully!');
        this.loadData();
      },
      error: (err) => {
        console.error('Failed to save PO', err);
        this.isSaving = false;
        this.showErrorToast('Failed to save changes. Please try again.');
      }
    });
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.isEditMode = false;
    this.isViewMode = false;
  }
}
