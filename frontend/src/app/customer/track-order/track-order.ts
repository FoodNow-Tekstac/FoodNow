import { Component, OnInit, OnDestroy, signal, inject, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, interval } from 'rxjs';
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
  private statusCheckInterval?: number;

  constructor() {
    // This effect will trigger the countdown when the order status changes
    effect(() => {
      const currentOrder = this.order();
      if (currentOrder?.status === 'OUT_FOR_DELIVERY' && !this.countdownInterval) {
        this.startEtaCountdown();
        this.startStatusPolling(); // Start polling for status updates
      } else if (currentOrder?.status === 'DELIVERED') {
        this.cleanupCountdown();
        this.stopStatusPolling();
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
        this.cleanupCountdown();
        // Don't try to update status here, let the backend handle it
        // Just refresh the order data
        this.refreshOrderData();
        return;
      }

      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      // Update the display string (e.g., "00:09")
      this.countdownDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      this.cdr.detectChanges(); // Manually update the view
    }, 1000);
  }

  /**
   * Start polling the backend every 2 seconds to check for status updates
   */
  private startStatusPolling(): void {
    this.stopStatusPolling(); // Ensure no old polling is running

    this.statusCheckInterval = window.setInterval(() => {
      this.refreshOrderData();
    }, 2000); // Check every 2 seconds
  }

  private stopStatusPolling(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = undefined;
    }
  }

  /**
   * Re-fetches the order data from the service to update the component's state.
   */
  private refreshOrderData(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        const currentOrder = this.order();
        const newOrder = data;
        
        // Check if status changed to DELIVERED
        if (currentOrder?.status !== 'DELIVERED' && newOrder.status === 'DELIVERED') {
          this.notificationService.success('Your order has arrived!');
          this.cleanupCountdown();
          this.stopStatusPolling();
        }
        
        this.order.set(newOrder);
      },
      error: (err) => {
        console.error('Failed to refresh order data:', err);
        // Don't show error notification for polling failures to avoid spam
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
    this.stopStatusPolling();
  }
}