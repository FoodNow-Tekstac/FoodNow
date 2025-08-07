import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'loading' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toasts = signal<Toast[]>([]);
  private lastId = 0;
  private loadingToastId: number | null = null;

  /**
   * Shows a self-removing toast. Now correctly accepts 'loading'.
   */
  show(message: string, type: Toast['type'] = 'info', duration: number = 4000) {
    // Hide any persistent loading toast before showing a new message
    this.hideLoading(); 
    
    const newToast: Toast = { id: this.lastId++, message, type };
    this.toasts.update(currentToasts => [newToast, ...currentToasts]);
    
    // Auto-hide the toast after the duration, including 'loading' toasts shown this way
    setTimeout(() => this.remove(newToast.id), duration);
  }

  /**
   * Shows a persistent 'loading' toast that must be hidden manually with hideLoading().
   */
  showLoading(message: string = 'Loading...') {
    if (this.loadingToastId !== null) {
      this.toasts.update(toasts => toasts.map(t => 
        t.id === this.loadingToastId ? { ...t, message } : t
      ));
      return;
    }
    const newToast: Toast = { id: this.lastId++, message, type: 'loading' };
    this.loadingToastId = newToast.id;
    this.toasts.update(currentToasts => [newToast, ...currentToasts]);
  }

  /**
   * Hides the persistent loading toast.
   */
  hideLoading() {
    if (this.loadingToastId !== null) {
      this.remove(this.loadingToastId);
      this.loadingToastId = null;
    }
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  /**
   * Removes a toast from the array by its ID.
   */
  private remove(id: number) {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }
}