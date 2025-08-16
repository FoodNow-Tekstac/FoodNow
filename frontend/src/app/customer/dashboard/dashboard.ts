import { Component, OnInit, signal, computed, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Restaurant, RestaurantService, MenuItem } from '../../restaurant/restaurant';
import { NotificationService } from '../../shared/notification';
import { FullUrlPipe } from '../../shared/pipes/full-url';

// An enhanced interface for display purposes, holding the pre-calculated counts
interface DisplayRestaurant extends Restaurant {
  dietaryCounts?: {
    VEG: number;
    NON_VEG: number;
    VEGAN: number;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FullUrlPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'] // Add a new CSS file for this component's styles
})
export class CustomerDashboardComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private notificationService = inject(NotificationService);

  private allRestaurants = signal<DisplayRestaurant[]>([]);
  
  searchTerm: WritableSignal<string> = signal('');
  dietaryFilter: WritableSignal<string> = signal('ALL');
  categoryFilter: WritableSignal<string> = signal('ALL');

  filteredRestaurants = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const diet = this.dietaryFilter();
    const category = this.categoryFilter();
    const restaurants = this.allRestaurants();

    if (!term && diet === 'ALL' && category === 'ALL') {
      return restaurants.map(r => ({ ...r, matchingItems: undefined }));
    }

    return restaurants
      .map(restaurant => {
        const restaurantCopy: DisplayRestaurant = { ...restaurant, matchingItems: undefined };

        let menuFilteredByDropdowns = restaurant.menu || [];
        if (diet !== 'ALL') {
          menuFilteredByDropdowns = menuFilteredByDropdowns.filter(item => item.dietaryType === diet);
        }
        if (category !== 'ALL') {
          menuFilteredByDropdowns = menuFilteredByDropdowns.filter(item => item.category === category);
        }
        
        if (menuFilteredByDropdowns.length > 0) {
          const restaurantNameMatch = term && restaurant.name.toLowerCase().includes(term);
          const itemMatchesInMenu = term ? menuFilteredByDropdowns.filter(item => item.name.toLowerCase().includes(term)) : [];

          if (restaurantNameMatch) {
            restaurantCopy.matchingItems = menuFilteredByDropdowns;
            return restaurantCopy;
          } else if (itemMatchesInMenu.length > 0) {
            restaurantCopy.matchingItems = itemMatchesInMenu;
            return restaurantCopy;
          } else if (!term) {
            return restaurantCopy;
          }
        }
        
        return null;
      })
      .filter((r): r is DisplayRestaurant => r !== null);
  });

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data: Restaurant[]) => {
        const displayData: DisplayRestaurant[] = data.map(restaurant => {
          const counts = { VEG: 0, NON_VEG: 0, VEGAN: 0 };
          let totalRatingPoints = 0;
          let totalRatingCount = 0;

          if (restaurant.menu) {
            for (const item of restaurant.menu) {
              // Dietary counts logic (existing)
              if (item.dietaryType === 'VEG') counts.VEG++;
              else if (item.dietaryType === 'NON_VEG') counts.NON_VEG++;
              else if (item.dietaryType === 'VEGAN') counts.VEGAN++;
              
              // --- START: New Rating Calculation Logic ---
              if (item.averageRating && item.ratingCount) {
                totalRatingPoints += item.averageRating * item.ratingCount;
                totalRatingCount += item.ratingCount;
              }
              // --- END: New Rating Calculation Logic ---
            }
          }
          
          // Calculate the final weighted average rating for the restaurant
          const averageRating = totalRatingCount > 0 ? totalRatingPoints / totalRatingCount : 0;

          return { ...restaurant, dietaryCounts: counts, averageRating: averageRating };
        });
        this.allRestaurants.set(displayData);
      },
      error: (err) => {
        this.notificationService.error('Failed to fetch restaurants');
      }
    });
  }
}