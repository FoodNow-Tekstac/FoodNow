import { Component, OnInit, signal, computed, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Restaurant, RestaurantService, MenuItem } from '../../restaurant/restaurant';
import { NotificationService } from '../../shared/notification';
import { FullUrlPipe } from '../../shared/pipes/full-url';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FullUrlPipe],
  templateUrl: './dashboard.html'
})
export class CustomerDashboardComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private notificationService = inject(NotificationService);

  private allRestaurants = signal<Restaurant[]>([]);
  
  searchTerm: WritableSignal<string> = signal('');
  dietaryFilter: WritableSignal<string> = signal('ALL');
  categoryFilter: WritableSignal<string> = signal('ALL');

  /**
   * This computed signal now includes the logic to find and attach 'matchingItems'.
   */
  filteredRestaurants = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const diet = this.dietaryFilter();
    const category = this.categoryFilter();
    const restaurants = this.allRestaurants();

    // If no filters are active, return all restaurants without any matching items highlighted.
    if (!term && diet === 'ALL' && category === 'ALL') {
      return restaurants.map(r => ({ ...r, matchingItems: undefined }));
    }

    // This logic now mirrors your original, working JavaScript file.
    return restaurants
      .map(restaurant => {
        const restaurantCopy: Restaurant = { ...restaurant, matchingItems: undefined };

        // 1. First, filter the menu based on the dropdowns (diet & category).
        let menuFilteredByDropdowns = restaurant.menu || [];
        if (diet !== 'ALL') {
          menuFilteredByDropdowns = menuFilteredByDropdowns.filter(item => item.dietaryType === diet);
        }
        if (category !== 'ALL') {
          menuFilteredByDropdowns = menuFilteredByDropdowns.filter(item => item.category === category);
        }
        
        // If the restaurant has any items that pass the dropdown filters, then check the search term.
        if (menuFilteredByDropdowns.length > 0) {
          const restaurantNameMatch = term && restaurant.name.toLowerCase().includes(term);
          const itemMatchesInMenu = term ? menuFilteredByDropdowns.filter(item => item.name.toLowerCase().includes(term)) : [];

          if (restaurantNameMatch) {
            // If the restaurant's name matches, show all items that passed the dropdown filters.
            restaurantCopy.matchingItems = menuFilteredByDropdowns;
            return restaurantCopy;
          } else if (itemMatchesInMenu.length > 0) {
            // If only specific items match the search, highlight just those items.
            restaurantCopy.matchingItems = itemMatchesInMenu;
            return restaurantCopy;
          } else if (!term) {
            // If there's no search term but the dropdowns matched, include the restaurant.
            // We don't highlight any specific items in this case.
            return restaurantCopy;
          }
        }
        
        // If no conditions were met, the restaurant doesn't match the filters.
        return null;
      })
      .filter((r): r is Restaurant => r !== null); // Remove all non-matching (null) restaurants from the final list.
  });

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe({
      next: data => {
        this.allRestaurants.set(data);
      },
      error: (err) => {
        this.notificationService.error('Failed to fetch restaurants');
      }
    });
  }
}