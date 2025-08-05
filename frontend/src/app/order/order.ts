import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// --- INTERFACES FOR CUSTOMER PAGES ---
export interface OrderItemSummary {
  quantity: number;
  itemName: string;
}

export interface Order {
  id: number;
  restaurantName: string;
  orderTime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  items: OrderItemSummary[];
  hasReview: boolean;
  reviewRating?: number;
  reviewComment?: string;
  deliveryAddress: string;
  restaurantLocationPin: string;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  // --- METHODS FOR CUSTOMER PAGES ---
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/my-orders`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/my-orders/${id}`);
  }

  updateOrderStatus(id: string, status: 'DELIVERED'): Observable<any> {
    const payload = { status };
    return this.http.patch(`${this.apiUrl}/manage/orders/${id}/status`, payload);
  }

  submitReview(orderId: string, review: ReviewPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/${orderId}/review`, review);
  }

  placeOrder(): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, null);
  }
}