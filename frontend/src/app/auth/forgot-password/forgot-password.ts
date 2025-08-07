import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  email: string = '';

  onSubmit(): void {
    if (!this.email) {
      this.notificationService.error('Please enter your email address.');
      return;
    }

    this.notificationService.show('Sending request...', 'info');

    // CHANGE: The backend now sends the email directly. We just need to
    // display the success message it returns.
    this.authService.forgotPassword(this.email).subscribe({
      next: (response: any) => {
        // Display the generic success message from the API.
        this.notificationService.success(response.message);

        // Optional: Redirect the user back to the login page after a few seconds.
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'An error occurred.');
      }
    });
  }
}