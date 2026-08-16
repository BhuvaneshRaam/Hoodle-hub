import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { SideDrawerComponent } from '../../../shared/ui/side-drawer/side-drawer.component';
import { VendorServiceService } from '../../services/vendor-service.service';
import { ToastService } from '../../../shared/services/toast.service';

export interface VendorListResponse {
  uuid?: string;
  vendorUuid?: string;
  vendorName?: string;
  contactPerson?: string;
  emailId?: string;
  contactPhone?: string;
  gstin?: string;
  pan?: string;
  billingAddress?: string;
  isActive?: boolean;
  statusBadge?: string;
  [key: string]: any;
}

export interface VendorCreateRequest {
  vendorName: string;
  contactPerson: string;
  emailId: string;
  contactPhone: string;
  gstin: string;
  pan: string;
  billingAddress: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-vendor',
  imports: [DataTableComponent, SideDrawerComponent, CommonModule, FormsModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent {
  constructor(
    private vendorService: VendorServiceService,
    private toastSvc: ToastService
  ) {}

  vendors = signal<VendorListResponse[]>([]);
  availableVendors = signal<VendorListResponse[]>([]);
  isLoading = signal<boolean>(true);

  isDrawerOpen = false;
  isEditMode = false;
  isViewMode = false;
  editingVendorId: string | null = null;

  vendorName = '';
  contactPerson = '';
  email = '';
  contactPhone = '';
  gstin = '';
  pan = '';
  billingAddress = '';
  isActive = true;
  isSubmitting = false;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  searchQuery = '';

  vendorColumns: TableColumn[] = [
    { key: 'vendorName', header: 'Vendor Name', type: 'text' },
    { key: 'emailId', header: 'Email', type: 'text' },
    { key: 'statusBadge', header: 'Status', type: 'badge' },
    {
      key: 'actions',
      header: 'Actions',
      type: 'action',
      actions: [
        { actionKey: 'VIEW', label: 'View', colorClass: 'text-gray-600 bg-gray-100 hover:bg-gray-200' },
        { actionKey: 'EDIT', label: 'Edit', colorClass: 'text-brand-600 bg-brand-50 hover:bg-brand-100' }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.isLoading.set(true);

    this.vendorService.getAllVendors(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response: any) => {
        const content = response?.content ?? [];
        const mappedVendors = content.map((vendor: any) => ({
          ...vendor,
          email: vendor.emailId ?? vendor.email ?? '',
          statusBadge: vendor.isActive ? 'ACTIVE' : 'INACTIVE'
        }));

        this.vendors.set(mappedVendors);
        this.availableVendors.set(mappedVendors);
        this.totalElements = response?.totalElements ?? mappedVendors.length;
        this.totalPages = response?.totalPages ?? 1;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch vendors', err);
        this.isLoading.set(false);
        this.toastSvc.show('Failed to load vendors. Please try again.', 'error');
      }
    });
  }

  openCreateDrawer(): void {
    this.isViewMode = false;
    this.isEditMode = false;
    this.editingVendorId = null;
    this.vendorName = '';
    this.contactPerson = '';
    this.email = '';
    this.contactPhone = '';
    this.gstin = '';
    this.pan = '';
    this.billingAddress = '';
    this.isActive = true;
    this.isDrawerOpen = true;
  }

  private mapVendorFormData(vendor: Partial<VendorListResponse>): void {
    this.vendorName = vendor.vendorName ?? '';
    this.contactPerson = vendor.contactPerson ?? '';
    this.email = vendor.emailId ?? vendor.emailId ?? '';
    this.contactPhone = vendor.contactPhone ?? '';
    this.gstin = vendor.gstin ?? '';
    this.pan = vendor.pan ?? '';
    this.billingAddress = vendor.billingAddress ?? '';
    this.isActive = vendor.isActive !== undefined ? vendor.isActive : true;
  }

  handleTableAction(event: { action: string; row: any }): void {
    if (event.action !== 'VIEW' && event.action !== 'EDIT') {
      return;
    }

    this.isViewMode = event.action === 'VIEW';
    this.isEditMode = event.action === 'EDIT';
    this.editingVendorId = event.row.uuid ?? event.row.vendorUuid ?? null;

    if (!this.editingVendorId) {
      this.mapVendorFormData(event.row);
      this.isDrawerOpen = true;
      return;
    }

    this.isDrawerOpen = true;
    this.isLoading.set(true);

    this.vendorService.getVendorById(this.editingVendorId).subscribe({
      next: (vendor: any) => {
        this.mapVendorFormData(vendor);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load vendor details', err);
        this.mapVendorFormData(event.row);
        this.isLoading.set(false);
        this.toastSvc.show('Unable to load vendor details.', 'error');
      }
    });
  }

  saveVendor(): void {
    if (this.isViewMode) {
      this.isDrawerOpen = false;
      return;
    }

    this.isSubmitting = true;

    const payload: VendorCreateRequest = {
      vendorName: this.vendorName,
      contactPerson: this.contactPerson,
      emailId: this.email,
      contactPhone: this.contactPhone,
      gstin: this.gstin,
      pan: this.pan,
      billingAddress: this.billingAddress,
      isActive: this.isActive
    };

    const request$ = this.isEditMode && this.editingVendorId
      ? this.vendorService.updateVendor(this.editingVendorId, payload)
      : this.vendorService.createVendor(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isDrawerOpen = false;
        this.loadVendors();
        this.toastSvc.show(
          this.isEditMode ? 'Vendor updated successfully!' : 'Vendor created successfully!',
          'success'
        );
      },
      error: (err) => {
        this.isSubmitting = false;
        const errorMsg = err?.error?.message || err?.error?.error || 'Unable to save vendor. Please try again.';
        this.toastSvc.show(errorMsg, 'error');
      }
    });
  }

  handlePageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadVendors();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadVendors();
  }
}
