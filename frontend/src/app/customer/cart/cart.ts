import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart, CartItem, CartService } from '../../cart/cart';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  cart = signal<Cart | null>(null);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data) => this.cart.set(data),
      error: () => this.notificationService.error('Could not load your cart.')
    });
  }

  updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      this.removeItem(item.id);
    } else {
      this.cartService.updateItemQuantity(item.id, newQuantity).subscribe(() => {
        this.loadCart(); // Refresh cart after update
      });
    }
  }

  removeItem(cartItemId: number) {
    this.cartService.removeItem(cartItemId).subscribe(() => {
      this.notificationService.success('Item removed from cart.');
      this.loadCart(); // Refresh cart after removal
    });
  }
}