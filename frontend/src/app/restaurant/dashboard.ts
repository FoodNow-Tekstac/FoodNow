import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

// --- INTERFACES FOR THE RESTAURANT DASHBOARD ---
export interface RestaurantOrderItem {
  quantity: number;
  itemName: string;
}
export interface RestaurantOrder {
  id: number;
  customerName: string;
  orderTime: string;
  totalPrice: number;
  status: 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  items: RestaurantOrderItem[];
  hasReview: boolean;
  reviewRating?: number;
  reviewComment?: string;
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
  private apiUrl = 'http://localhost:8080/api';

  dashboardData = signal<DashboardData | null>(null);

  fetchDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/restaurant/dashboard`).pipe(
      tap(data => this.dashboardData.set(data))
    );
  }

  // --- ORDER MANAGEMENT METHODS ---
  updateOrderStatus(orderId: number, status: 'PREPARING' | 'CANCELLED'): Observable<any> {
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