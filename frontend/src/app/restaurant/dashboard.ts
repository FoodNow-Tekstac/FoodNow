import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

// --- INTERFACES FOR THE RESTAURANT DASHBOARD ---

export interface RestaurantOrderItem {
  quantity: number;
  itemName: string;
}

// This is the key change to fix the errors
export interface RestaurantOrder {
  id: number;
  orderTime: string;
  totalPrice: number;
  // UPDATED: The status type now includes all possible values.
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  items: RestaurantOrderItem[];
  hasReview: boolean;
  reviewRating?: number;
  reviewComment?: string;
  // UPDATED: Changed from customerName to a nested customer object.
  customer: {
    id: number;
    name: string;
  };
}

export interface DashboardData {
  orders: RestaurantOrder[];
  restaurantProfile: { name: string; [key: string]: any };
  menu: any[];
  reviews: any[];
}

export interface MenuItemPayload {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryType: string;
  imageUrl?: string;
  available?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantDashboardService {
  private http = inject(HttpClient);
  // Using your API url structure
  private apiUrl = 'http://localhost:8080/api';

  dashboardData = signal<DashboardData | null>(null);

  constructor() {
    // Automatically fetch data when the service is initialized
    this.fetchDashboardData().subscribe();
  }

  fetchDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/restaurant/dashboard`).pipe(
      tap(data => this.dashboardData.set(data))
    );
  }

  // --- ORDER MANAGEMENT METHODS ---
  // UPDATED: The status type here should match the full RestaurantOrder['status'] type
  updateOrderStatus(orderId: number, status: RestaurantOrder['status']): Observable<any> {
    return this.http.patch(`${this.apiUrl}/manage/orders/${orderId}/status`, { status });
  }

  markOrderReadyForPickup(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/restaurant/orders/${orderId}/ready`, {});
  }

  addMenuItem(itemData: MenuItemPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/restaurant/menu`, itemData);
  }

  updateMenuItem(itemId: number, itemData: MenuItemPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurant/menu/${itemId}`, itemData);
  }

  deleteMenuItem(itemId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/restaurant/menu/${itemId}`, { responseType: 'text' });
  }

  updateItemAvailability(itemId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/restaurant/menu/${itemId}/availability`, {});
  }
}
