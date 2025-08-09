import { Component, OnInit, OnDestroy, signal, inject, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Order, OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-order.html',
  styleUrls: ['./track-order.css']
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  // --- Injected Services ---
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  // --- Component State ---
  order = signal<Order | null>(null);
  orderId = '';
  
  // --- Countdown Timer Properties ---
  countdownDisplay = '10:00'; // Initial display for 10 seconds
  etaDisplay = '';
  private countdownInterval?: number;

  constructor() {
    // This effect will trigger the countdown when the order status changes
    effect(() => {
      const currentOrder = this.order();
      if (currentOrder?.status === 'OUT_FOR_DELIVERY' && !this.countdownInterval) {
        this.startEtaCountdown();
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
  
  startEtaCountdown(): void {
    this.cleanupCountdown(); // Ensure no old timers are running

    const totalDurationSeconds = 10; // Set to 10 seconds for the demo
    const etaTime = new Date(Date.now() + totalDurationSeconds * 1000);

    // Set the static ETA display (e.g., "09:20 PM")
    this.etaDisplay = etaTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    this.notificationService.success(`Your order is on the way! ETA: ${this.etaDisplay}`);

    this.countdownInterval = window.setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.round((etaTime.getTime() - now) / 1000);

      if (remainingSeconds <= 0) {
        this.countdownDisplay = '00:00';
        this.markOrderAsDelivered();
        return;
      }

      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      // Update the display string (e.g., "00:09")
      this.countdownDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      this.cdr.detectChanges(); // Manually update the view
    }, 1000);
  }

  markOrderAsDelivered(): void {
    this.cleanupCountdown(); // Stop the timer immediately
    if (this.order()?.status === 'DELIVERED') return;

    this.orderService.updateOrderStatus(this.orderId, 'DELIVERED').subscribe({
      next: () => {
        this.notificationService.success('Your order has arrived!');
        // Re-fetch data to simulate a component refresh
        this.refreshOrderData();
      },
      error: () => this.notificationService.error('Failed to update order status')
    });
  }

  /**
   * Re-fetches the order data from the service to update the component's state.
   */
  private refreshOrderData(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order.set(data);
        // The `effect` will see the status change and the UI will update naturally.
      },
      error: () => {
        // If refresh fails, at least update the local state to avoid a stale UI
        this.notificationService.error('Could not refresh order status. Please refresh the page.');
        const currentOrder = this.order();
        if (currentOrder) {
          this.order.set({ ...currentOrder, status: 'DELIVERED' });
        }
      }
    });
  }

  private cleanupCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }
  
  ngOnDestroy(): void {
    this.cleanupCountdown();
  }
}
