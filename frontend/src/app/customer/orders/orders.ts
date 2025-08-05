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
  styleUrls: ['./orders.css'] // Add this line
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  orders = signal<Order[]>([]);

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data: Order[]) => {
        const sortedData = data.sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());
        this.orders.set(sortedData);
      },
      error: () => this.notificationService.error('Could not load your order history.')
    });
  }

  // UPDATED: This now returns semantic class names for better styling control
  getStatusClass(status: Order['status']): string {
    const statusMap = {
      DELIVERED: 'status-delivered',
      OUT_FOR_DELIVERY: 'status-out-for-delivery',
      PREPARING: 'status-preparing',
      CONFIRMED: 'status-preparing', // Using same style as preparing
      PENDING: 'status-pending',
      CANCELLED: 'status-cancelled',
    };
    return statusMap[status] || 'status-pending';
  }
}