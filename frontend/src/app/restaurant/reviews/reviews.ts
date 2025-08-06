import { Component, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RestaurantDashboardService } from '../dashboard';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css'] // Add this line
})
export class RestaurantReviewsComponent {
  private dashboardService = inject(RestaurantDashboardService);

  reviews = computed(() => (this.dashboardService.dashboardData()?.reviews || [])
    .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()));

  // --- NEW: Analytics computed signal ---
  reviewStats = computed(() => {
    const allReviews = this.reviews();
    if (allReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: [0, 0, 0, 0, 0] // [1-star, 2-star, ..., 5-star]
      };
    }

    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;

    const ratingBreakdown = [0, 0, 0, 0, 0];
    for (const review of allReviews) {
      ratingBreakdown[review.rating - 1]++;
    }

    return {
      averageRating,
      totalReviews: allReviews.length,
      ratingBreakdown: ratingBreakdown.reverse() // Reverse for 5-star to 1-star order
    };
  });

  // --- UPDATED: To show both filled and empty stars ---
  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}