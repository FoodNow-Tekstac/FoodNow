import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth'; // Corrected import
import { NotificationService } from '../../shared/notification'; // Corrected import
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  isLoading = signal(false);
  isRegisterMode = signal(false);
  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', phoneNumber: '', password: '' };

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  toggleMode(event: Event) {
    event.preventDefault();
    this.isRegisterMode.update(value => !value);
  }

  onLogin() {
    this.isLoading.set(true);
    this.authService.login(this.loginData).subscribe({
      error: (err) => {
        this.notificationService.show(err.error?.message || 'Login failed.', 'error');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  onRegister() {
    this.isLoading.set(true);
    this.authService.register(this.registerData).subscribe({
      next: () => {
        setTimeout(() => this.isRegisterMode.set(false), 2000);
      },
      error: (err) => {
        this.notificationService.show(err.error?.message || 'Registration failed.', 'error');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}