import { Injectable, signal } from '@angular/core';

/**
 * Defines the structure for a single toast message.
 */
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'loading';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * A signal that holds the array of currently active toasts.
   */
  toasts = signal<Toast[]>([]);
  
  private lastId = 0;

  /**
   * The main method to display a toast. It's called by the helper methods below.
   * @param message The text to display in the toast.
   * @param type The style of the toast ('success', 'error', 'loading').
   * @param duration How long the toast should be visible in milliseconds.
   */
  show(message: string, type: Toast['type'] = 'success', duration: number = 4000) {
    const newToast: Toast = { id: this.lastId++, message, type };
    
    // Add the new toast to the beginning of the array
    this.toasts.update(currentToasts => [newToast, ...currentToasts]);

    // Automatically remove the toast after the duration, unless it's a 'loading' toast.
    if (type !== 'loading') {
      setTimeout(() => this.remove(newToast.id), duration);
    }
  }

  /**
   * Helper method to easily show a success toast.
   * @param message The success message to display.
   */
  success(message: string) {
    this.show(message, 'success');
  }

  /**
   * Helper method to easily show an error toast.
   * @param message The error message to display.
   */
  error(message: string) {
    this.show(message, 'error');
  }

  /**
   * Removes a toast from the array by its ID.
   * @param id The unique ID of the toast to remove.
   */
  remove(id: number) {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }
}