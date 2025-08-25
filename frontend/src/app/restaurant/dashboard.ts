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
  orderTime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  items: RestaurantOrderItem[];
  hasReview: boolean;
  reviewRating?: number;
  reviewComment?: string;
  customer: {
    id: number;
    name: string;
  };
}

// 1. CREATE a specific interface for the restaurant profile
export interface RestaurantProfile {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  businessId: string;
  ownerName: string;
  imageUrl: string | null;
  // menu can be null here as it's handled separately in the dashboard
  menu: any[] | null; 
}

// 2. USE the new RestaurantProfile interface here
export interface DashboardData {
  orders: RestaurantOrder[];
  restaurantProfile: RestaurantProfile; 
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

  constructor() {
    this.fetchDashboardData().subscribe();
  }

  fetchDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/restaurant/dashboard`).pipe(
      tap(data => this.dashboardData.set(data))
    );
  }

  // --- ORDER MANAGEMENT METHODS ---
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