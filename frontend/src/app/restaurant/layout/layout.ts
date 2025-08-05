import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { RestaurantDashboardService } from '../dashboard';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class RestaurantLayoutComponent implements OnInit {
  private dashboardService = inject(RestaurantDashboardService);
  private authService = inject(AuthService);

  // Make the signal available to the template
  restaurantData = this.dashboardService.dashboardData;

  ngOnInit(): void {
    // Fetch all data when the layout loads
    this.dashboardService.fetchDashboardData().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}