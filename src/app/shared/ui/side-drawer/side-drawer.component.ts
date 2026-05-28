import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-drawer',
  imports: [CommonModule],
  templateUrl: './side-drawer.component.html',
  styleUrl: './side-drawer.component.css'
})
export class SideDrawerComponent {
  @Input() public isOpen: boolean = false;
  @Input() public title: string = 'Drawer Title';
  
  // Emits an event to the parent component to change the `isOpen` state
  @Output() public closed = new EventEmitter<void>();

  public closeDrawer(): void {
    this.closed.emit();
  }
}
