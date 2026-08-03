import { Component, signal } from '@angular/core';
import { AdminServiceService } from '../../services/admin-service.service';
import { ModulePermission } from '../models/module-permisson.model';
import { RoleRequest } from '../models/role-request.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SideDrawerComponent } from '../../../shared/ui/side-drawer/side-drawer.component';
import { DataTableComponent, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-role-management',
  imports: [CommonModule, FormsModule, DataTableComponent, SideDrawerComponent],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {
  roles = signal<any[]>([]);
  matrix = signal<ModulePermission[]>([]);
  isLoading = signal<boolean>(true);

  isDrawerOpen: boolean = false;
  isEditMode: boolean = false;
  editingRoleId: number | null = null;
  
  roleName = '';
  isActive = true;
  selectedPermissions = new Set<number>();

  isSubmitting: boolean = false;

  roleColumns: TableColumn[] = [
    { key: 'name', header: 'Role Name', type: 'text' },
    { key: 'permissionCount', header: 'Permissions', type: 'text' },
    { key: 'statusBadge', header: 'Status', type: 'badge' },
    { key: 'actions', header: 'Actions', type: 'action', actions: [{ actionKey: 'EDIT', label: 'Edit' }, { actionKey: 'VIEW', label: 'View' },] }
  ];

  privilegeColumns = ['READ', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'];
  isViewMode: boolean= false;

  constructor(private adminService: AdminServiceService, private toastSvc: ToastService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadMatrix();
  }


  openCreateDrawer() {
    this.isEditMode = false;
    this.editingRoleId = null;
    this.roleName = '';
    this.isActive = true;
    this.selectedPermissions.clear();
    this.isDrawerOpen = true;
  }

  handleTableAction(event: { action: string, row: any }) {
    if (event.action === 'EDIT' || event.action === 'VIEW' ) {
      this.isViewMode = event.action === 'VIEW'; 
      this.isEditMode = event.action === 'EDIT';
      this.editingRoleId = event.row.id;
      this.roleName = event.row.name;
      this.isActive = event.row.active;
      
      this.selectedPermissions.clear();
      if (event.row.permissions) {
        event.row.permissions.forEach((p: any) => {
          this.selectedPermissions.add(p.id);
        });
      }
      
      this.isDrawerOpen = true;
    }
  }

  loadRoles() {
    this.isLoading.set(true);
    this.adminService.getAllTenantRoles().subscribe({
      next: (data) => {
        const mappedRoles = data.map((role: any) => ({
          ...role,
          permissionCount: `${role.permissions?.length || 0} Permissions`,
          statusBadge: role.active ? 'ACTIVE' : 'INACTIVE'
        }));
        this.roles.set(mappedRoles);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch roles', err);
        this.isLoading.set(false);
      }
    });
  }

  loadMatrix() {
    this.adminService.getPermissionMatrix().subscribe(data => {
      this.matrix.set(data);
    });
  }

  saveRole() {
    this.isSubmitting = true;
    const requestPayload: RoleRequest = {
      roleName: this.roleName,
      permissionIds: Array.from(this.selectedPermissions),
      isActive: this.isActive
    };

    if (this.isEditMode && this.editingRoleId) {
      
      this.adminService.updateRole(this.editingRoleId.toString(), requestPayload).subscribe({
        next: (response) => {
        this.isSubmitting = false;
        this.isDrawerOpen = false;
        this.loadRoles();
        this.toastSvc.show('Role updated successfully!', 'success');
        },
        error: (err) => {
          this.isSubmitting = false;
          const errorMsg = err.error?.error || 'Failed to update role. Please try again.';
          this.toastSvc.show(errorMsg, 'error');
        }

      });
    } else {
      this.adminService.createRole(requestPayload).subscribe({
        next: (response) => {
        this.isSubmitting = false;
        this.isDrawerOpen = false;
        this.loadRoles();
        this.toastSvc.show('Role created successfully!', 'success');
        },
        error: (err) => {
          this.isSubmitting = false;
          const errorMsg = err.error?.error || 'Failed to create role. Please try again.';
          this.toastSvc.show(errorMsg, 'error');
        }
      });
    }
  }

  togglePermission(permissionId: number) {
    if (this.selectedPermissions.has(permissionId)) {
      this.selectedPermissions.delete(permissionId);
    } else {
      this.selectedPermissions.add(permissionId);
    }
  }

  getPermissionIdForCell(module: any, colName: string): number | null {
    const privilege = module.availablePrivileges.find((p: any) => p.privilegeName === colName);
    return privilege ? privilege.permissionId : null;
  }

  formatModuleName(name: string): string {
    if (!name) return '';
    return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }
}
