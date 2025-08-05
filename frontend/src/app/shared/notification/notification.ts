import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification'; // Correctly imports the service

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent {
  /**
   * Injects the NotificationService so the template can access its `toasts` signal.
   */
  protected notificationService = inject(NotificationService);
}

export { NotificationService };
