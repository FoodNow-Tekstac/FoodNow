// src/app/restaurant/restaurant.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// We can define interfaces for our data for type safety
export interface MenuItem {
  id: number; // Add the 'id' property
  name: string;
  price: number;
  dietaryType: string;
  category: string;
    description?: string; // <-- ADD THIS LINE
averageRating?: number;
  ratingCount?: number;
  imageUrl?: string; // Add the optional 'imageUrl' property
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  menu: MenuItem[];
  matchingItems?: MenuItem[]; // Optional property for search results
    averageRating?: number; // <-- ADD THIS LINE

}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/public/restaurants`);
  }

  applyForPartnership(applicationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/restaurant/apply`, applicationData);
  }

  /**
   * --- THIS IS THE MISSING METHOD ---
   * Fetches a single restaurant and its menu by its unique ID.
   * @param id The ID of the restaurant.
   */
  getRestaurantById(id: string): Observable<Restaurant> {
    // Note: Based on your restaurant.js, your backend might expect an endpoint like:
    // `${this.apiUrl}/public/restaurants/${id}/menu`
    // If the line below doesn't work, try swapping it with the one above.
    return this.http.get<Restaurant>(`${this.apiUrl}/public/restaurants/${id}/menu`);
  }
}