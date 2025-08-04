import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaces for strong typing
export interface OrderItemSummary {
  quantity: number;
  itemName: string;
}

export interface Order {
  id: number;
  restaurantName: string;
  orderTime: string; // ISO date string
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  items: OrderItemSummary[];
  hasReview: boolean;
  deliveryAddress: string; // <-- ADD THIS
  restaurantLocationPin: string; // <-- ADD THIS
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

  /**
   * Fetches the order history for the currently logged-in user.
   */
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/my-orders`);
  }

  // --- ADD THESE NEW METHODS ---

  /**
   * Fetches the details for a single order.
   * As per your JS file: GET /api/orders/my-orders/{id}
   */
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/my-orders/${id}`);
  }

  /**
   * Updates the status of an order.
   * As per your JS file: PATCH /api/manage/orders/{id}/status
   */
  updateOrderStatus(id: string, status: 'DELIVERED'): Observable<any> {
    const payload = { status };
    // Using the PATCH method as specified in your JS
    return this.http.patch(`${this.apiUrl}/manage/orders/${id}/status`, payload);
  }

  submitReview(orderId: string, review: ReviewPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/${orderId}/review`, review);
  }

  placeOrder(): Observable<Order> {
    // This POST request doesn't need a body, as the backend
    // will create the order from the cart associated with the user's token.
    return this.http.post<Order>(`${this.apiUrl}/orders`, null);
  }
}