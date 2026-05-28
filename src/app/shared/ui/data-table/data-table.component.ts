import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface TableColumn {
  key: string;
  header: string;
  type: 'text' | 'badge' | 'currency' | 'action';
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
}
