import { Component, OnInit, OnDestroy, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Order, OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';
import * as L from 'leaflet'; // Import Leaflet

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-order.html'
})
export class TrackOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  order = signal<Order | null>(null);
  orderId = '';
  private map!: L.Map; // To hold the map instance

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

  ngAfterViewInit(): void {
    // We wait for the view to be initialized so the 'map' div exists.
    // But the map logic depends on the order data, which is async.
    // We'll initialize the map once the order data is available.
    // Let's create an effect for this.
  }

  // We will move the map initialization here to be triggered by the template
  initMap(): void {
    const order = this.order();
    if (!order || !order.restaurantLocationPin || this.map) return; // Only init once
    if (order.status === 'DELIVERED') return;

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

  // Simulate movement in stages over 30 seconds
  setTimeout(() => scooterMarker.setLatLng([
    start[0] + (end[0] - start[0]) * 0.25,
    start[1] + (end[1] - start[1]) * 0.25
  ]), 7500); // 7.5s

  setTimeout(() => scooterMarker.setLatLng([
    start[0] + (end[0] - start[0]) * 0.5,
    start[1] + (end[1] - start[1]) * 0.5
  ]), 15000); // 15s

  setTimeout(() => scooterMarker.setLatLng([
    start[0] + (end[0] - start[0]) * 0.75,
    start[1] + (end[1] - start[1]) * 0.75
  ]), 22500); // 22.5s

  setTimeout(() => {
    scooterMarker.setLatLng(end);
    this.notificationService.success('Your order has arrived!');
    this.markOrderAsDelivered(); // Will only succeed if backend hasn't already auto-marked it
  }, 30000); // 30s
}


  markOrderAsDelivered(): void {
    this.orderService.updateOrderStatus(this.orderId, 'DELIVERED').subscribe({
      next: () => console.log('Order status updated to DELIVERED.'),
      error: () => this.notificationService.error('Failed to update order status.')
    });
  }

  ngOnDestroy(): void {
    // Important: destroy the map instance to prevent memory leaks
    if (this.map) {
      this.map.remove();
    }
  }
}