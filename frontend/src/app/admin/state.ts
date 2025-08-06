import { Injectable, signal, computed } from '@angular/core';
import { PendingApplication, AdminRestaurant, AdminUser, AdminOrder, AdminDeliveryAgent } from './admin';

export type AdminSection = 'overview' | 'applications' | 'restaurants' | 'users' | 'orders' | 'delivery';
export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}
@Injectable({
  providedIn: 'root'
})
export class AdminStateService {
  // Signal for the active view
  activeSection = signal<AdminSection>('overview');

  // Signals to hold all the data for the admin panel
  applications = signal<PendingApplication[]>([]);
  restaurants = signal<AdminRestaurant[]>([]);
  users = signal<AdminUser[]>([]);
  orders = signal<AdminOrder[]>([]);
  deliveryAgents = signal<AdminDeliveryAgent[]>([]);
  sortConfig = signal<{ [key: string]: SortConfig }>({});

  // Computed signal to get the title for the current page
  pageTitle = computed(() => {
    switch (this.activeSection()) {
      case 'overview': return 'Admin Overview';
      case 'applications': return 'Pending Restaurant Applications';
      case 'restaurants': return 'All Restaurants';
      case 'users': return 'All Users';
      case 'orders': return 'All Orders';
      case 'delivery': return 'Delivery Agents';
      default: return 'Admin Panel';
    }
  });
}