import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableAction {
  label: string;
  actionKey: string; // e.g., 'VIEW', 'EDIT', 'APPROVE', 'DELETE'
  colorClass?: string; // Optional: To make Delete buttons red, etc.
  showIf?: (row: any) => boolean;
}

export interface TableColumn {
  key: string;
  header: string;
  type: 'text' | 'badge' | 'currency' | 'action' | 'date';
  actions?: TableAction[]; // Only for 'action' type columns
}

@Component({
  selector: 'app-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Input() selectable: boolean = false;

  @Input() showPagination: boolean = false;
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 1;
  @Input() totalElements: number = 0;
  @Input() pageSize: number = 10;

  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();
  @Output() pageChanged = new EventEmitter<number>();

  onActionClick(actionKey: string, row: any) {
    this.actionClicked.emit({ action: actionKey, row });
  }

  onPrevPage() {
    if (this.currentPage > 0) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  formatBadgeText(val: string): string {
    if (!val) return '';

    return val
      .split('_')
      .map(word => {
        if (word.length <= 2) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}
