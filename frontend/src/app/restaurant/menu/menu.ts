import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantDashboardService } from '../dashboard';
import { FullUrlPipe } from '../../shared/pipes/full-url';
import { NotificationService } from '../../shared/notification';
import { MenuItemModalComponent } from '../menu-item-modal/menu-item-modal';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  dietaryType?: string;
  category?: string;
  available: boolean;
}

interface MenuItemWithStats extends MenuItem {
  timesOrdered: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FullUrlPipe, MenuItemModalComponent],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class RestaurantMenuComponent {
  protected dashboardService = inject(RestaurantDashboardService);
  private notificationService = inject(NotificationService);

  isModalOpen = signal(false);
  currentItemForEdit = signal<MenuItem | null>(null);

  menuItemsWithStats = computed(() => {
    const menu = this.dashboardService.dashboardData()?.menu || [];
    const deliveredOrders = (this.dashboardService.dashboardData()?.orders || []).filter(o => o.status === 'DELIVERED');

    return menu.map(item => {
      let timesOrdered = 0;
      let totalRevenue = 0;
      for (const order of deliveredOrders) {
        for (const orderItem of order.items) {
          if (orderItem.itemName === item.name) {
            timesOrdered += orderItem.quantity;
            totalRevenue += orderItem.quantity * item.price;
          }
        }
      }
      return { ...item, timesOrdered, totalRevenue };
    });
  });

  openAddModal(): void {
    this.currentItemForEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(item: MenuItem): void {
    this.currentItemForEdit.set({ ...item });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.currentItemForEdit.set(null);
  }

  handleSave(): void {
    this.closeModal();
    setTimeout(() => {
      this.dashboardService.fetchDashboardData().subscribe();
    }, 100);
  }

  toggleAvailability(item: MenuItem): void {
    item.available = !item.available;

    this.dashboardService.updateItemAvailability(item.id).subscribe({
      error: () => {
        this.notificationService.error('Failed to update availability.');
        item.available = !item.available;
      }
    });
  }

  deleteItem(itemId: number): void {
    if (confirm('Are you sure you want to delete this item? This cannot be undone.')) {
      this.dashboardService.deleteMenuItem(itemId).subscribe({
        next: () => {
          this.notificationService.success('Item deleted successfully.');
          this.dashboardService.fetchDashboardData().subscribe();
        },
        error: (err) => {
          const errorMessage = err.status === 409 ? err.error.message : 'Failed to delete item.';
          this.notificationService.error(errorMessage);
        }
      });
    }
  }
}
