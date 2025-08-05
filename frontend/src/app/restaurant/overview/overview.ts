import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantDashboardService } from '../dashboard';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
})
export class RestaurantOverviewComponent {
  private dashboardService = inject(RestaurantDashboardService);
  // Create computed signals to derive data for the view
  pendingOrders = computed(() => (this.dashboardService.dashboardData()?.orders || []).filter(o => o.status === 'PENDING').length);
  totalMenuItems = computed(() => (this.dashboardService.dashboardData()?.menu || []).length);
  totalRevenue = computed(() => (this.dashboardService.dashboardData()?.orders || [])
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalPrice, 0));
}