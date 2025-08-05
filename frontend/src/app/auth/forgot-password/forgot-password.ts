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
    this.authService.forgotPassword(this.email).subscribe({
      next: (result) => {
        if (result.resetLink) {
          // Navigate to the confirmation page, passing the link as a query parameter
          this.router.navigate(['/forgot-password-confirmation'], {
            queryParams: { link: result.resetLink }
          });
        } else {
          this.notificationService.success('If an account exists for this email, a reset link has been sent.');
        }
      },
      error: (err) => this.notificationService.error(err.error?.message || 'An error occurred.')
    });
  }
}