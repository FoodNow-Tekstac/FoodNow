import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantDashboardService } from '../dashboard';
import { FullUrlPipe } from '../../shared/pipes/full-url';
import { NotificationService } from '../../shared/notification';
import { MenuItemModalComponent } from '../menu-item-modal/menu-item-modal';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FullUrlPipe, MenuItemModalComponent],
  templateUrl: './menu.html',
})
export class RestaurantMenuComponent {
  protected dashboardService = inject(RestaurantDashboardService);
  private notificationService = inject(NotificationService);

  menuItems = computed(() => this.dashboardService.dashboardData()?.menu || []);
  
  isModalOpen = signal(false);
  currentItemForEdit = signal<any | null>(null);

  openAddModal(): void {
    this.currentItemForEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(item: any): void {
    this.currentItemForEdit.set({ ...item }); // Pass a copy to prevent accidental changes
    this.isModalOpen.set(true);
  }
  
  closeModal(): void {
    this.isModalOpen.set(false);
    this.currentItemForEdit.set(null);
  }

  handleSave(): void {
    this.closeModal();
    // Use a small timeout to allow the modal to close before refreshing data
    setTimeout(() => {
      this.dashboardService.fetchDashboardData().subscribe();
    }, 100);
  }

  toggleAvailability(item: any): void {
    // Immediately update the UI for a snappy feel
    item.available = !item.available;
    
    this.dashboardService.updateItemAvailability(item.id).subscribe({
      // We don't need to do anything on success, as the UI is already updated
      error: () => {
        this.notificationService.error('Failed to update availability.');
        // Revert the change on error
        item.available = !item.available; 
      }
    });
  }

  deleteItem(itemId: number): void {
    if (confirm('Are you sure you want to delete this item? This cannot be undone.')) {
      this.dashboardService.deleteMenuItem(itemId).subscribe({
        next: () => {
          this.notificationService.success('Item deleted successfully.');
          this.dashboardService.fetchDashboardData().subscribe(); // Refresh data
        },
        error: (err) => {
          // The backend sends a detailed error message for 409 Conflict
          const errorMessage = err.status === 409 ? err.error.message : 'Failed to delete item.';
          this.notificationService.error(errorMessage);
        }
      });
    }
  }
}