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
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  email = '';
  isLoading = false;

  onSubmit(): void {
    if (!this.email) {
      this.notificationService.error('Please enter your email address.');
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.notificationService.hideLoading();
        this.notificationService.success(
          response?.message || 'If an account exists, a reset link has been sent.'
        );
        // navigate after short delay so user can read message
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.hideLoading();
        this.notificationService.error(err?.error?.message || 'An error occurred.');
      }
    });
  }
}
