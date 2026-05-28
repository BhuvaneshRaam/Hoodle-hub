import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;

  // Dynamically assigns Tailwind classes based on the chosen variant
  get variantClasses(): string {
    switch (this.variant) {
      case 'primary':
        return 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm border border-transparent focus:ring-brand-600';
      case 'secondary':
        return 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-transparent focus:ring-brand-300';
      case 'outline':
        return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm focus:ring-gray-300';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent focus:ring-red-600'; // <-- Fixed!
      default:
        return '';
    }
  }
}
