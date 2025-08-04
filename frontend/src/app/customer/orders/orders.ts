import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order, OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  orders = signal<Order[]>([]);

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => this.orders.set(data.sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime())),
      error: () => this.notificationService.error('Could not load your order history.')
    });
  }

  getStatusColor(status: Order['status']): string {
    const colors = {
      DELIVERED: 'bg-green-500 text-white',
      OUT_FOR_DELIVERY: 'bg-blue-500 text-white',
      PREPARING: 'bg-yellow-500 text-black',
      CONFIRMED: 'bg-yellow-500 text-black',
      PENDING: 'bg-gray-500 text-white',
      CANCELLED: 'bg-red-500 text-white',
    };
    return colors[status] || 'bg-gray-600';
  }
}