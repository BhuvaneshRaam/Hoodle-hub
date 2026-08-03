import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  currentToast = signal<ToastMessage | null>(null);

  show(message: string, type: 'success' | 'error') {
    this.currentToast.set({ message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.currentToast.set(null);
    }, 3000);
  }
}
