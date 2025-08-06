import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { MenuItem } from '../restaurant/restaurant'; // Assuming MenuItem has an id property

// Let's define a clear interface for a CartItem
export interface CartItem {
  id: number;
  quantity: number;
  foodItem: MenuItem; // The backend sends the full FoodItemDto
}

export interface Cart {
  id: number;
  totalPrice: number;
  items: CartItem[];
  [key: string]: any; // ✅ Allows any type, but loses strict type safety
}


@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/cart';

  private cartItemCount = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCount.asObservable();

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl).pipe(
      tap(cart => this.cartItemCount.next(cart?.items?.length || 0))
    );
  }

  addToCart(menuItemId: number, quantity: number): Observable<Cart> {
    const payload = { foodItemId: menuItemId, quantity };
    return this.http.post<Cart>(`${this.baseUrl}/items`, payload).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  updateItemQuantity(cartItemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/items/${cartItemId}`, { quantity });
  }

  removeItem(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/items/${cartItemId}`);
  }
}
