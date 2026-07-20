import { Component } from '@angular/core';
import { DataTableComponent, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { PrqServiceService } from '../../services/prq-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { SideDrawerComponent } from '../../../shared/ui/side-drawer/side-drawer.component';
import { Router } from '@angular/router';
import { PoServiceService } from '../../services/po-service.service';

@Component({
  selector: 'app-purchase-request',
  imports: [CommonModule, DataTableComponent, FormsModule, SideDrawerComponent],
  templateUrl: './purchase-request.component.html',
  styleUrl: './purchase-request.component.css'
})
export class PurchaseRequestComponent {

  constructor(
    private prqService: PrqServiceService,
    private poService: PoServiceService,
    private router: Router
  ) { }

  prqData: any[] = [];
  isDrawerOpen: boolean = false;
  isSubmitting: boolean = false;
  isSuccess: boolean = false;

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  showSuccessToast(message: string) {
    this.toastType = 'success';
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }

  showErrorToast(message: string) {
    this.toastType = 'error';
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3500);
  }

  currentPage: number = 0;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  isEditMode: boolean = false;
  editingId: string | null = null;

  isViewMode: boolean = false; 

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
          label: 'Submit', 
          actionKey: 'SUBMIT', 
          colorClass: 'text-brand-700 bg-brand-50 border-brand-200 hover:bg-brand-100', 
          showIf: (row) => row.status === 'DRAFT' 
        },
        { 
          label: 'Approve', 
          actionKey: 'APPROVE', 
          colorClass: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100',
          showIf: (row) => row.status === 'SUBMITTED' 
        },
        { 
          label: 'Create PO', 
          actionKey: 'CREATE_PO', 
          colorClass: 'text-brand-700 bg-brand-50 border-brand-200 hover:bg-brand-100',
          showIf: (row) => row.status === 'APPROVED' 
        }
      ]
    }
  ];



  // 3. Handle the Action Clicks
  handleTableAction(event: { action: string; row: any }) {
    const rowUuid = event.row.id;

    if (event.action === 'VIEW') {
      this.isViewMode = true;

      this.prqService.getRequestById(rowUuid).subscribe({
        next: (fullPrq: any) => {
          this.newRequest = {
            department: fullPrq.department,
            remarks: fullPrq.remarks || '',
            items: fullPrq.items ? fullPrq.items : []
          };
          this.openDrawer();
        },
        error: (err: any) => {
          console.error('Failed to fetch PRQ details', err);
          this.showErrorToast('Failed to load request details. Please try again.');
        }
      });
    } 
    
    else if (event.action === 'EDIT') {
      this.isEditMode = true;
      this.editingId = rowUuid;

      this.prqService.getRequestById(rowUuid).subscribe({
        next: (fullPrq: any) => {
          this.newRequest = {
            department: fullPrq.department,
            remarks: fullPrq.remarks || '',
            items: fullPrq.items ? JSON.parse(JSON.stringify(fullPrq.items)) : []
          };
          this.openDrawer();
        },
        error: (err: any) => {
          console.error('Failed to fetch PRQ details', err);
          this.showErrorToast('Failed to load request for editing. Please try again.');
          this.isEditMode = false;
          this.editingId = null;
        }
      });
    }
    
    // Handle the SUBMIT click
    else if (event.action === 'SUBMIT') {
      this.prqService.submitRequest(rowUuid).subscribe({
        next: () => {
          this.showSuccessToast('Draft submitted successfully!');
          this.loadData();
        },
        error: (err: any) => {
          console.error('Failed to submit draft', err);
          this.showErrorToast('Failed to submit request. Please try again.');
        }
      });
    }
    
    // Handle the APPROVE click
    else if (event.action === 'APPROVE') {
      this.prqService.approveRequest(rowUuid).subscribe({
        next: () => {
          this.showSuccessToast('Request approved successfully!');
          this.loadData();
        },
        error: (err: any) => {
          console.error('Failed to approve request', err);
          this.showErrorToast('Failed to approve request. Please try again.');
        }
      });
    }

    // Handle the CREATE_PO click
    else if (event.action === 'CREATE_PO') {
      this.poService.generateOrder(rowUuid).subscribe({
        next: () => {
          this.showSuccessToast('Purchase Order generated! Redirecting...');
          setTimeout(() => {
            this.router.navigate(['/app/purchase-orders']);
          }, 1200);
        },
        error: (err: any) => {
          console.error('Failed to generate PO', err);
          this.showErrorToast('Failed to generate Purchase Order. Please try again.');
        }
      });
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
    this.isEditMode = false;
    this.editingId = null;
    this.isSuccess = false;
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
    
    // Check if we are Creating or Editing!
    const apiCall = this.isEditMode && this.editingId 
      ? this.prqService.updateRequest(this.editingId, this.newRequest)
      : this.prqService.createRequest(this.newRequest);

    apiCall.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSuccess = true;
        const msg = this.isEditMode ? 'Request updated successfully!' : 'Request created successfully!';
        this.showSuccessToast(msg);
        setTimeout(() => {
          this.closeDrawer(form);
          this.loadData();
        }, 600);
      },
      error: (err: any) => {
        console.error('Submission failed', err);
        this.isSubmitting = false;
        const msg = this.isEditMode ? 'Failed to update request. Please try again.' : 'Failed to create request. Please try again.';
        this.showErrorToast(msg);
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
