import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../shared/notification'; // Corrected import

function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) { return {}; }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private apiUrl = 'http://localhost:8080/api/auth';
  private loadingToastId: number | null = null;

  private showLoading(message: string) {
    this.hideLoading(); // Ensure only one loading toast at a time
    this.notificationService.show(message, 'loading');
    this.loadingToastId = this.notificationService.toasts()[0].id;
  }

  private hideLoading() {
    if (this.loadingToastId !== null) {
      this.notificationService.remove(this.loadingToastId);
      this.loadingToastId = null;
    }
  }

  login(credentials: any): Observable<any> {
    this.showLoading('Logging in...');
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.hideLoading();
        if (response && response.accessToken) {
          localStorage.setItem('foodnow_token', response.accessToken);
          this.notificationService.show('Login successful! Redirecting...', 'success');
          this.navigateUserByRole(response.accessToken);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    this.showLoading('Creating account...');
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' }).pipe(
      tap(responseMessage => {
         this.hideLoading();
         this.notificationService.show(responseMessage, 'success');
      })
    );
  }

  logout() {
    localStorage.removeItem('foodnow_token');
    this.router.navigate(['/login']);
  }

  // ... keep all other code and imports

// Find this private method at the bottom of the AuthService class
private navigateUserByRole(token: string): void {
    // --- START: ADD THESE LOGS ---
    console.log("Attempting to navigate based on token...");
    const decodedToken = parseJwt(token);
    console.log("Decoded Token Payload:", decodedToken);

    const userRole = decodedToken.roles?.[0]; // The ?. is optional chaining
    console.log("Extracted User Role:", userRole);
    // --- END: ADD THESE LOGS ---

    setTimeout(() => {
      if (userRole === 'ROLE_ADMIN') {
        console.log("Redirecting to ADMIN dashboard...");
        this.router.navigate(['/admin/dashboard']);
      } else if (userRole === 'ROLE_RESTAURANT_OWNER') {
        console.log("Redirecting to RESTAURANT dashboard...");
        this.router.navigate(['/restaurant/dashboard']);
      } else if (userRole === 'ROLE_DELIVERY_PERSONNEL') {
        console.log("Redirecting to DELIVERY dashboard...");
        this.router.navigate(['/delivery/dashboard']);
      } else if (userRole === 'ROLE_CUSTOMER') { // --- ADDED THIS LOG ---
        console.log("Redirecting to CUSTOMER dashboard...");
        this.router.navigate(['/customer/dashboard']);
      } else {
        // --- ADD THIS ERROR LOG ---
        console.error("NAVIGATION FAILED: Role not recognized or no role found.", userRole);
        this.notificationService.error("Could not determine user role for redirection.");
      }
    }, 1500);
  }
forgotPassword(email: string): Observable<{ resetLink: string }> {
    return this.http.post<{ resetLink: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Resets the password using a token.
   * Corresponds to: POST /api/auth/reset-password
   */
  resetPassword(payload: { token: string; newPassword: string }): Observable<any> {
    // The backend expects a text response, so we set responseType to 'text'
    return this.http.post(`${this.apiUrl}/reset-password`, payload, { responseType: 'text' });
  }
// ... keep the rest of the class
}