import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Restaurant, RestaurantService, MenuItem } from '../../restaurant/restaurant';
import { CartService } from '../../cart/cart';
import { NotificationService } from '../../shared/notification';
import { FullUrlPipe } from '../../shared/pipes/full-url';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FullUrlPipe],
  templateUrl: './restaurant-detail.html',
    styleUrls: ['./restaurant-detail.css'] // <-- ADD THIS LINE

})
export class RestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  restaurant = signal<Restaurant | null>(null);

  ngOnInit() {
    // Get the 'id' from the URL and then fetch the restaurant data
    this.route.paramMap.pipe(
      switchMap(params => {
        const restaurantId = params.get('id');
        if (!restaurantId) {
          // Handle case where ID is missing, though router should prevent this
          return []; 
        }
        return this.restaurantService.getRestaurantById(restaurantId);
      })
    ).subscribe({
      next: data => this.restaurant.set(data),
      error: () => this.notificationService.error('Could not load restaurant details.')
    });
  }

  addToCart(item: MenuItem, quantityInput: HTMLInputElement) {
    const quantity = parseInt(quantityInput.value, 10);

    if (isNaN(quantity) || quantity < 1) {
      this.notificationService.error('Please enter a valid quantity.');
      return;
    }

    this.cartService.addToCart(item.id, quantity).subscribe({
      next: () => {
        this.notificationService.success(`${quantity} x ${item.name} added to cart!`);
        quantityInput.value = '1'; // Reset quantity input
      },
      error: () => this.notificationService.error('Failed to add item to cart.')
    });
  }
}