import { Component, OnInit, OnDestroy, signal, inject, effect } from '@angular/core'; // Add 'effect'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Order, OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';
import * as L from 'leaflet';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-order.html',
    styleUrls: ['./track-order.css'] // <-- ADD THIS LINE

})
export class TrackOrderComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  order = signal<Order | null>(null);
  orderId = '';
  private map!: L.Map;

  constructor() {
    // This effect runs automatically when the order() signal gets data.
    // This is the correct way to initialize the map.
    effect(() => {
      const currentOrder = this.order();
      if (currentOrder && !this.map) {
        this.initializeMap(currentOrder);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.orderId = params.get('orderId')!;
        return this.orderService.getOrderById(this.orderId);
      })
    ).subscribe({
      next: (data) => this.order.set(data),
      error: () => this.notificationService.error('Could not load order details.')
    });
  }
  
  initializeMap(order: Order): void {
    if (!order.restaurantLocationPin || order.status === 'DELIVERED') {
        return;
    }

    const restaurantCoords = order.restaurantLocationPin.split(',').map(Number) as L.LatLngTuple;
    const customerCoords = [restaurantCoords[0] + 0.05, restaurantCoords[1] + 0.05] as L.LatLngTuple;

    this.map = L.map('map').setView(restaurantCoords, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    L.marker(restaurantCoords).addTo(this.map).bindPopup('<b>Restaurant</b>').openPopup();
    L.marker(customerCoords).addTo(this.map).bindPopup('<b>Your Location</b>');

    if (order.status === 'OUT_FOR_DELIVERY') {
      this.simulateDelivery(restaurantCoords, customerCoords);
    }
  }

  simulateDelivery(start: L.LatLngTuple, end: L.LatLngTuple): void {
  const scooterIcon = L.divIcon({ className: 'scooter-icon', html: '🛵' });
  const scooterMarker = L.marker(start, { icon: scooterIcon }).addTo(this.map);

  const duration = 20000; // 20 seconds total
  const fps = 60; // 60 frames per second for smooth animation
  const frameInterval = 1000 / fps; // ~16.67ms per frame
  const totalFrames = duration / frameInterval;
  
  let currentFrame = 0;
  
  const animateScooter = () => {
    if (currentFrame >= totalFrames) {
      // Animation complete
      scooterMarker.setLatLng(end);
      this.notificationService.success('Your order has arrived!');
      this.markOrderAsDelivered();
      return;
    }
    
    // Calculate progress (0 to 1)
    const progress = currentFrame / totalFrames;
    
    // Use easing function for more natural movement (ease-in-out)
    const easedProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Calculate current position
    const currentLat = start[0] + (end[0] - start[0]) * easedProgress;
    const currentLng = start[1] + (end[1] - start[1]) * easedProgress;
    
    // Update scooter position
    scooterMarker.setLatLng([currentLat, currentLng]);
    
    currentFrame++;
    requestAnimationFrame(animateScooter);
  };
  
  // Start the animation
  requestAnimationFrame(animateScooter);
}
  markOrderAsDelivered(): void {
    // --- THIS IS THE FIX FOR THE RACE CONDITION ---
    // First, check if the order is already marked as delivered.
    if (this.order()?.status === 'DELIVERED') {
      console.log('Order status is already DELIVERED. No frontend update needed.');
      return; // Do nothing
    }

    this.orderService.updateOrderStatus(this.orderId, 'DELIVERED').subscribe({
      next: () => {
        console.log('Frontend successfully updated order status to DELIVERED.');
        // Update our local state to match
        const currentOrder = this.order();
        if (currentOrder) {
          this.order.set({ ...currentOrder, status: 'DELIVERED' });
        }
      },
      error: () => { /* The error case is now less likely to happen */ }
    });
  }
  
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}