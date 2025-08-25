// src/app/restaurant/restaurant.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  dietaryType: string;
  category: string;
  description?: string;
  averageRating?: number;
  ratingCount?: number;
  imageUrl?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  menu: MenuItem[];
  matchingItems?: MenuItem[];
  averageRating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getRestaurants(): Observable<Restaurant[]> {
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(7);
    
    return this.http.get<Restaurant[]>(
      `${this.apiUrl}/public/restaurants?_t=${timestamp}&_r=${randomId}`
    );
  }

  applyForPartnership(applicationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/restaurant/apply`, applicationData);
  }

  getRestaurantById(id: string): Observable<Restaurant> {
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(7);
    
    return this.http.get<Restaurant>(
      `${this.apiUrl}/public/restaurants/${id}/menu?_t=${timestamp}&_r=${randomId}`
    );
  }

  /**
   * NEW, CORRECT METHOD: Uploads a file and updates the restaurant image.
   * @param file The image file to upload.
   */
  uploadRestaurantImage(file: File): Observable<Restaurant> {
    const formData = new FormData();
    // The key 'file' must match @RequestParam("file") in the controller
    formData.append('file', file);

    // Call the new POST endpoint that accepts the file
    return this.http.post<Restaurant>(`${this.apiUrl}/restaurant/profile/upload-image`, formData);
  }
}