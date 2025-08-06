import { Component, computed, inject, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantDashboardService, RestaurantOrder } from '../dashboard';
import { NotificationService } from '../../shared/notification';

type OrderStatus = 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

@Component({
  selector: 'app-restaurant-orders',
  standalone: true,
  imports: [CommonModule],
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
    return this.allOrders().filter(o => o.status === status);
  });

  orderCounts = computed(() => {
    const counts = { PENDING: 0, PREPARING: 0, OUT_FOR_DELIVERY: 0, DELIVERED: 0 };
    for (const order of this.allOrders()) {
      if (order.status in counts) {
        counts[order.status as OrderStatus]++;
      }
    }
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
      const newPendingCount = this.pendingOrders().length;
      if (newPendingCount > this.lastPendingCount) {
        this.playNotificationSound();
      }
      this.lastPendingCount = newPendingCount;
    });
  }

  // --- LIFECYCLE HOOKS ---
  ngOnInit(): void {
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
      for (const order of this.pendingOrders()) {
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

  private updateLocalOrderStatus(orderId: number, status: RestaurantOrder['status']) {
    this.dashboardService.dashboardData.update(currentData => {
      if (!currentData) return null;
      const updatedOrders = currentData.orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      return { ...currentData, orders: updatedOrders };
    });
  }

  private pendingOrders = computed(() =>
    this.allOrders().filter(o => o.status === 'PENDING')
  );

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
        this.dashboardService.dashboardData.update(data => {
          if (!data) return null;
          data.orders = data.orders.filter(o => o.id !== order.id);
          return data;
        });
        this.notificationService.success(`Order #${order.id} has been cancelled.`);
      },
      error: () => this.notificationService.error('Failed to reject order.')
    });
  }

  readyForPickup(order: RestaurantOrder) {
    this.notificationService.show('Finding a delivery agent...', 'loading');
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
