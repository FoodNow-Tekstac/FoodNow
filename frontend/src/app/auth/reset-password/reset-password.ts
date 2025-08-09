import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  token: string | null = null;
  newPassword = '';
  confirmPassword = '';
  isLoading = false;

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

    this.isLoading = true;
    this.notificationService.showLoading('Resetting your password...');

    const payload = { token: this.token, newPassword: this.newPassword };

    this.authService.resetPassword(payload).subscribe({
      next: (message) => {
        this.isLoading = false;
        this.notificationService.hideLoading();
        this.notificationService.success(message);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.hideLoading();
        this.notificationService.error(err.error?.message || 'Failed to reset password.');
      }
    });
  }
}