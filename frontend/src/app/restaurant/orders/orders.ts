import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantDashboardService, RestaurantOrder } from '../dashboard';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-restaurant-orders', // A different selector
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
})
export class RestaurantOrdersComponent implements OnInit {
  private dashboardService = inject(RestaurantDashboardService);
  private notificationService = inject(NotificationService);
  
  // This gets data from the parent layout's service call
  private allOrders = computed(() => this.dashboardService.dashboardData()?.orders || []);

  // --- COMPUTED SIGNALS FOR KANBAN COLUMNS ---
  pendingOrders = computed(() => this.allOrders().filter(o => o.status === 'PENDING'));
  preparingOrders = computed(() => this.allOrders().filter(o => o.status === 'PREPARING'));
  deliveryOrders = computed(() => this.allOrders().filter(o => o.status === 'OUT_FOR_DELIVERY'));
  deliveredOrders = computed(() => this.allOrders().filter(o => o.status === 'DELIVERED'));

  ngOnInit(): void {
    // The parent layout component (RestaurantLayoutComponent) is responsible for the initial data fetch.
    // This component simply reacts to the data changes in the service.
  }
  
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
      error: (err) => this.notificationService.error(err.error?.message || 'No delivery agents available.')
    });
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
}