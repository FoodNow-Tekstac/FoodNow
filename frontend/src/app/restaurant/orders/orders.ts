import { Component, computed, inject, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RestaurantDashboardService, RestaurantOrder } from '../dashboard';
import { NotificationService } from '../../shared/notification';

// This type now correctly reflects all possible statuses
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

@Component({
  selector: 'app-restaurant-orders',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class RestaurantOrdersComponent implements OnInit, OnDestroy {
  private dashboardService = inject(RestaurantDashboardService);
  private notificationService = inject(NotificationService);
  private audioContext = new AudioContext();
  private timerInterval: any;
  private lastPendingCount = 0;

  // --- SIGNALS & COMPUTED STATE ---

  selectedStatus = signal<OrderStatus>('PENDING');

  private allOrders = computed(() => this.dashboardService.dashboardData()?.orders || []);

  filteredOrders = computed(() => {
    const status = this.selectedStatus();
    if (status === 'PENDING') {
      // This will now work correctly once you update the RestaurantOrder interface
      return this.allOrders().filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');
    }
    return this.allOrders().filter(o => o.status === status);
  });

  orderCounts = computed(() => {
    // Initialize with all possible statuses to avoid errors
    const counts: Record<OrderStatus, number> = { PENDING: 0, CONFIRMED: 0, PREPARING: 0, OUT_FOR_DELIVERY: 0, DELIVERED: 0, CANCELLED: 0 };
    let pendingAndConfirmedCount = 0;

    for (const order of this.allOrders()) {
      if (order.status === 'PENDING' || order.status === 'CONFIRMED') {
        pendingAndConfirmedCount++;
      } else if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    }
    
    // For the UI, group PENDING and CONFIRMED together
    counts.PENDING = pendingAndConfirmedCount;
    return counts;
  });

  kitchenPrepSummary = computed(() => {
    const summary: { [key: string]: number } = {};
    const preparing = this.allOrders().filter(o => o.status === 'PREPARING');
    for (const order of preparing) {
      for (const item of order.items) {
        summary[item.itemName] = (summary[item.itemName] || 0) + item.quantity;
      }
    }
    return Object.entries(summary).sort(([, a], [, b]) => b - a);
  });

  timeSinceOrder = signal<{ [key: number]: string }>({});

  constructor() {
    // --- Sound notification for new pending orders ---
    effect(() => {
      const currentPendingCount = this.orderCounts().PENDING;
      if (currentPendingCount > this.lastPendingCount) {
        this.playNotificationSound();
        this.notificationService.success('You have a new order!');
      }
      this.lastPendingCount = currentPendingCount;
    });
  }

  // --- LIFECYCLE HOOKS ---
  ngOnInit(): void {
    // REMOVED: this.dashboardService.loadDashboard(); 
    // The service handles its own data loading.
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  // --- HELPER METHODS ---

  selectStatus(status: OrderStatus): void {
    this.selectedStatus.set(status);
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const newTimes: { [key: number]: string } = {};
      const pendingOrders = this.allOrders().filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');

      for (const order of pendingOrders) {
        const orderTime = new Date(order.orderTime).getTime();
        const diff = now - orderTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        newTimes[order.id] = `${minutes}m ${seconds}s`;
      }
      this.timeSinceOrder.set(newTimes);
    }, 1000);
  }

  private playNotificationSound(): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // Ding sound
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  private updateLocalOrderStatus(orderId: number, status: OrderStatus) {
    this.dashboardService.dashboardData.update(currentData => {
      if (!currentData) return null;
      const updatedOrders = currentData.orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      return { ...currentData, orders: updatedOrders };
    });
  }

  // --- ORDER ACTIONS ---

  acceptOrder(order: RestaurantOrder) {
    this.dashboardService.updateOrderStatus(order.id, 'PREPARING').subscribe({
      next: () => {
        this.updateLocalOrderStatus(order.id, 'PREPARING');
        this.notificationService.success(`Order #${order.id} accepted.`);
      },
      error: () => this.notificationService.error('Failed to accept order.')
    });
  }

  rejectOrder(order: RestaurantOrder) {
    this.dashboardService.updateOrderStatus(order.id, 'CANCELLED').subscribe({
      next: () => {
        // Instead of just updating status, we remove the order from the list locally
        this.dashboardService.dashboardData.update(data => {
          if (!data) return null;
          data.orders = data.orders.filter(o => o.id !== order.id);
          return { ...data };
        });
        this.notificationService.success(`Order #${order.id} has been cancelled.`);
      },
      error: () => this.notificationService.error('Failed to reject order.')
    });
  }

  readyForPickup(order: RestaurantOrder) {
    this.dashboardService.markOrderReadyForPickup(order.id).subscribe({
      next: () => {
        this.updateLocalOrderStatus(order.id, 'OUT_FOR_DELIVERY');
        this.notificationService.success('Delivery agent assigned!');
      },
      error: (err) =>
        this.notificationService.error(err.error?.message || 'No delivery agents available.')
    });
  }
}
