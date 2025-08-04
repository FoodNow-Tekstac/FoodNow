import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  token: string | null = null;
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.notificationService.error('Invalid or missing reset token.');
    }
  }

  onSubmit(): void {
    if (!this.token) {
      this.notificationService.error('Cannot reset password without a valid token.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.error('Passwords do not match.');
      return;
    }

    this.notificationService.show('Resetting your password...', 'loading');
    const payload = { token: this.token, newPassword: this.newPassword };

    this.authService.resetPassword(payload).subscribe({
      next: (message) => {
        this.notificationService.success(message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => this.notificationService.error(err.error?.message || 'Failed to reset password.')
    });
  }
}