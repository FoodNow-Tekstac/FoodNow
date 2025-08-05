import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../shared/notification';
import { parseJwt } from '../shared/jwt-utils'; // <-- IMPORT the shared function

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private apiUrl = 'http://localhost:8080/api/auth';

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.accessToken) {
          localStorage.setItem('foodnow_token', response.accessToken);
          this.notificationService.success('Login successful! Redirecting...');
          this.navigateUserByRole(response.accessToken);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' }).pipe(
      tap(responseMessage => {
         this.notificationService.success(responseMessage);
      })
    );
  }

  logout() {
    localStorage.removeItem('foodnow_token');
    this.router.navigate(['/login']);
  }

  private navigateUserByRole(token: string): void {
    const decodedToken = parseJwt(token);
    const userRole = decodedToken.roles?.[0];

    // This logic should now be correct from our previous fix
    if (userRole === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/applications']);
    } else if (userRole === 'ROLE_RESTAURANT_OWNER') {
      this.router.navigate(['/restaurant/overview']);
    } else if (userRole === 'ROLE_DELIVERY_PERSONNEL') {
      this.router.navigate(['/delivery/dashboard']);
    } else {
      this.router.navigate(['/customer/dashboard']);
    }
  }

  forgotPassword(email: string): Observable<{ resetLink: string }> {
    return this.http.post<{ resetLink: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(payload: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, payload, { responseType: 'text' });
  }
}