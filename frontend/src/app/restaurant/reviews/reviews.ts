import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantDashboardService } from '../dashboard';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.html',
})
export class RestaurantReviewsComponent {
  private dashboardService = inject(RestaurantDashboardService);

  reviews = computed(() => (this.dashboardService.dashboardData()?.reviews || [])
    .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()));

  getStars(rating: number): any[] {
    return new Array(rating);
  }
}