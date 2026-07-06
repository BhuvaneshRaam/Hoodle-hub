import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableAction {
  label: string;
  actionKey: string; // e.g., 'VIEW', 'EDIT', 'APPROVE', 'DELETE'
  colorClass?: string; // Optional: To make Delete buttons red, etc.
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

  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();

  onActionClick(actionKey: string, row: any) {
    this.actionClicked.emit({ action: actionKey, row });
  }
}
