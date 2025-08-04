import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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

  /**
   * Fetches the profile for the currently authenticated user.
   * Corresponds to: GET /api/profile
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  /**
   * Updates the profile for the currently authenticated user.
   * Corresponds to: PUT /api/profile
   */
  updateProfile(profileData: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profileData);
  }
}