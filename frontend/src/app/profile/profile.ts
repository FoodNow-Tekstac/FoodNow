// profile.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

// An interface for our user profile data for type safety
export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/profile';
  
  // Shared signal for profile data across components
  public profileSignal = signal<UserProfile | null>(null);

  /**
   * Fetches the profile for the currently authenticated user.
   * Corresponds to: GET /api/profile
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl).pipe(
      tap(profile => this.profileSignal.set(profile))
    );
  }

  /**
   * Updates the profile for the currently authenticated user.
   * Corresponds to: PUT /api/profile
   */
  updateProfile(profileData: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profileData).pipe(
      tap(updatedProfile => this.profileSignal.set(updatedProfile))
    );
  }

  /**
   * Gets the current profile from the signal
   */
  getCurrentProfile(): UserProfile | null {
    return this.profileSignal();
  }
}