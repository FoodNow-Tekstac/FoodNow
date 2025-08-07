import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../shared/notification';
import { parseJwt } from '../shared/jwt-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private apiUrl = 'http://localhost:8080/api/auth';

  /**
   * Handles user login, showing loading and success/error notifications.
   */
  login(credentials: any): Observable<any> {
    this.notificationService.showLoading('Logging in...');
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap({
        next: (response) => {
          this.notificationService.hideLoading();
          if (response && response.accessToken) {
            localStorage.setItem('foodnow_token', response.accessToken);
            this.notificationService.success('Login successful!');
            this.navigateUserByRole(response.accessToken);
          }
        },
        error: (err) => {
          this.notificationService.hideLoading();
          this.notificationService.error(err.error?.message || 'Login failed.');
        }
      })
    );
  }

  /**
   * Handles new user registration.
   */
  register(userData: any): Observable<any> {
    this.notificationService.showLoading('Creating account...');
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' }).pipe(
      tap({
        next: (responseMessage) => {
          this.notificationService.hideLoading();
          this.notificationService.success(responseMessage);
        },
        error: (err) => {
          this.notificationService.hideLoading();
          this.notificationService.error(err.error?.message || 'Registration failed.');
        }
      })
    );
  }

  /**
   * Logs the user out by clearing the token and navigating to the login page.
   */
  logout() {
    localStorage.removeItem('foodnow_token');
    this.router.navigate(['/login']);
  }

  /**
   * Navigates the user to the correct dashboard based on their role from the JWT.
   */
  private navigateUserByRole(token: string): void {
    const decodedToken = parseJwt(token);
    const userRole = decodedToken.roles?.[0];

    // Use a short timeout to allow the success toast to be seen
    setTimeout(() => {
      if (userRole === 'ROLE_ADMIN') {
        this.router.navigate(['/admin/applications']);
      } else if (userRole === 'ROLE_RESTAURANT_OWNER') {
        this.router.navigate(['/restaurant/overview']);
      } else if (userRole === 'ROLE_DELIVERY_PERSONNEL') {
        this.router.navigate(['/delivery/dashboard']);
      } else {
        this.router.navigate(['/customer/dashboard']);
      }
    }, 500);
  }

  /**
   * Requests a password reset link for the given email.
   */
  forgotPassword(email: string): Observable<{ resetLink: string }> {
    return this.http.post<{ resetLink: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Resets the password using a token and new password.
   */
  resetPassword(payload: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, payload, { responseType: 'text' });
  }
}