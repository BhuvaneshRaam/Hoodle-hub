import { Component, signal } from '@angular/core';
import { DataTableComponent, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { SideDrawerComponent } from '../../../shared/ui/side-drawer/side-drawer.component';
import { AdminServiceService } from '../../services/admin-service.service';
import { Role } from '../models/role.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-user-management',
  imports: [DataTableComponent, SideDrawerComponent, CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
   
  constructor(private adminSvc: AdminServiceService, private toastSvc: ToastService) {}
  
  users = signal<any[]>([]); 
  availableRoles = signal<Role[]>([]);
  isLoading = signal<boolean>(true);

  selectedRoles = new Set<number>();

  isDrawerOpen:boolean = false;
  isEditMode:boolean = false;
  isViewMode:boolean = false;
  editingUserId: string | null = null;
  expandedRoles = new Set<number>();
  
  userName: string = '';
  emailId: string = '';
  isActive:boolean = true;

  isSubmitting: boolean = false;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  searchQuery = '';
  searchTimeout: any;

  userColumns: TableColumn[] = [
    { key: 'userName', header: 'Name', type: 'text' },
    { key: 'emailId', header: 'Email', type: 'text' },
    { key: 'roleNames', header: 'Roles', type: 'text' },
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
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.adminSvc.getAllTenantUsers(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response: any) => {
        const mappedUsers = response.content.map((user: any) => ({
          ...user,
          roleNames: user.roles.map((r: any) => r.name).join(', '),
          statusBadge: user.isActive ? 'ACTIVE' : 'INACTIVE' 
        }));
        this.users.set(mappedUsers);
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading.set(false);
      },
      error: (err) => console.error('Failed to fetch users', err)
    });
  }

  loadRoles() {
    this.adminSvc.getAllTenantRolesList().subscribe({
      next: (response: any) => this.availableRoles.set(response),
      error: (err) => console.error('Failed to fetch roles', err)
    });
  }

  handleTableAction(event: { action: string, row: any }) {
    if (event.action === 'EDIT' || event.action === 'VIEW') {
      this.isViewMode = event.action === 'VIEW';
      this.isEditMode = event.action === 'EDIT';

      this.editingUserId = event.row.userUuid; 
      this.userName = event.row.userName || event.row.name || ''; 
      this.emailId = event.row.emailId || event.row.email || '';
      this.isActive = event.row.isActive !== undefined ? event.row.isActive : true;

      this.selectedRoles.clear();
      if (event.row.roles) {
        event.row.roles.forEach((r: any) => {
          this.selectedRoles.add(r.id);
        });
      }

      console.log('Editing user:', event.row.userUuid);
      this.expandedRoles.clear();
      this.isDrawerOpen = true;
    }
  }

  openCreateDrawer() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.editingUserId = null;
    
    this.userName = '';
    this.emailId = '';
    this.isActive = true;
    
    this.selectedRoles.clear();
    this.expandedRoles.clear();
    this.isDrawerOpen = true;
  }


  toggleRole(roleId: number) {
    if (this.selectedRoles.has(roleId)) {
      this.selectedRoles.delete(roleId);
    } else {
      this.selectedRoles.add(roleId);
    }
  }

  toggleExpandRole(event: Event, roleId: number) {
    event.preventDefault();
    event.stopPropagation(); 

    if (this.expandedRoles.has(roleId)) {
      this.expandedRoles.delete(roleId);
    } else {
      this.expandedRoles.add(roleId);
    }
  }

  
  isRoleExpanded(roleId: number): boolean {
    return this.expandedRoles.has(roleId);
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoles.has(roleId);
  }


  formatName(name: string): string {
    if (!name) return '';
    return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  getGroupedPermissions(permissions: any[]) {
    if (!permissions) return [];
    
    const grouped = permissions.reduce((acc: any, perm: any) => {
      const modName = this.formatName(perm.module);
      const privName = this.formatName(perm.privilege);
      
      if (!acc[modName]) {
        acc[modName] = [];
      }
      acc[modName].push(privName);
      return acc;
    }, {});

    return Object.keys(grouped).map(key => ({
      module: key,
      privileges: grouped[key]
    }));
  }

  saveUser() {
    this.isSubmitting = true;
    const payload = {
      userName: this.userName,
      emailId: this.emailId,
      roleIds: Array.from(this.selectedRoles), 
      isActive: this.isActive
    };

    if (this.isEditMode && this.editingUserId) {
      this.adminSvc.updateUser(this.editingUserId, payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.isDrawerOpen = false;
          this.loadUsers();
          this.toastSvc.show('User updated successfully!', 'success'); 
        },
        error: (err) => {
          this.isSubmitting = false;
          const errorMsg = err.error?.error || 'Failed to update user. Please try again.';
          this.toastSvc.show(errorMsg, 'error');
        }
      });
    } 

    else {
      this.adminSvc.createUser(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.isDrawerOpen = false;
          this.loadUsers(); 
          this.toastSvc.show('User invited successfully!', 'success');
        },
        error: (err) => {
         this.isSubmitting = false;
         const errorMsg = err.error?.error || 'Failed to invite user. Please try again.';
         this.toastSvc.show(errorMsg, 'error');
        }
      });
    }
  }

  handlePageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadUsers();
  }
}
