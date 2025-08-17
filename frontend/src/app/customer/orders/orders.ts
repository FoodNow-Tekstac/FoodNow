import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order, OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  orders = signal<Order[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (data: Order[]) => {
        const sortedData = data.sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());
        this.orders.set(sortedData);
      },
      error: () => this.notificationService.error('Could not load your order history.')
    });
  }

  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      // Note: The backend expects the status as 'CANCELLED'
      this.orderService.updateOrderStatus(orderId.toString(), 'CANCELLED').subscribe({
        next: () => {
          this.notificationService.success('Order cancelled successfully.');
          this.loadOrders(); // Refresh the list of orders
        },
        error: () => this.notificationService.error('Could not cancel the order.')
      });
    }
  }

  getStatusClass(status: Order['status']): string {
    const statusMap = {
      DELIVERED: 'status-delivered',
      OUT_FOR_DELIVERY: 'status-out-for-delivery',
      PREPARING: 'status-preparing',
      CONFIRMED: 'status-preparing',
      PENDING: 'status-pending',
      CANCELLED: 'status-cancelled',
    };
    return statusMap[status] || 'status-pending';
  }
}
