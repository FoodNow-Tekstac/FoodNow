import { Component, OnInit, inject, signal, effect, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService, PendingApplication } from '../admin';
import { NotificationService } from '../../shared/notification';
import { AdminStateService, AdminSection } from '../state';
import { AdminOverviewComponent } from '../overview/overview';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, AdminOverviewComponent],
  templateUrl: './page.html',
  styleUrls: ['./page.css']
})
export class AdminPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);
  protected state = inject(AdminStateService);

  isAgentModalOpen = signal(false);
  newAgentForm = this.getEmptyAgentForm();

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const section = params.get('section') as AdminSection | 'overview';
      this.state.activeSection.set(section || 'overview');
    });
  }

  approve(app: PendingApplication): void {
    this.adminService.approveApplication(app.id).subscribe({
      next: () => {
        this.notificationService.success(`Approved ${app.restaurantName}.`);
        this.adminService.fetchDataForSection('applications').subscribe();
      },
      error: () => this.notificationService.error('Failed to approve application.')
    });
  }

  reject(app: PendingApplication): void {
    const reason = prompt("Please provide a reason for rejecting this application:");
    if (reason && reason.trim()) {
      this.adminService.rejectApplication(app.id, { reason }).subscribe({
        next: () => {
          this.notificationService.success(`Rejected ${app.restaurantName}.`);
          this.adminService.fetchDataForSection('applications').subscribe();
        },
        error: () => this.notificationService.error('Failed to reject application.')
      });
    }
  }

  openAgentModal(): void {
    this.newAgentForm = this.getEmptyAgentForm();
    this.isAgentModalOpen.set(true);
  }

  closeAgentModal(): void {
    this.isAgentModalOpen.set(false);
  }

  onAddAgentSubmit(): void {
    //this.notificationService.show('Creating agent...', 'loading');
    this.adminService.createDeliveryAgent(this.newAgentForm).subscribe({
      next: () => {
        this.notificationService.success('Agent created successfully!');
        this.closeAgentModal();
        this.adminService.fetchDataForSection('delivery').subscribe();
      },
      error: (err) => this.notificationService.error(err.error?.message || 'Failed to create agent.')
    });
  }

  private getEmptyAgentForm() {
    return { name: '', email: '', phoneNumber: '', password: '' };
  }

  // Sorting
  sortData(column: string): void {
    const section = this.state.activeSection();
    if (section === 'overview') return;

    const currentSort = this.state.sortConfig()[section];
    let direction: 'asc' | 'desc' = 'asc';

    if (currentSort && currentSort.column === column && currentSort.direction === 'asc') {
      direction = 'desc';
    }

    this.state.sortConfig.update(config => ({
      ...config,
      [section]: { column, direction }
    }));
  }

private createSorter<T>(dataSignal: () => T[], sectionKey: string){
    return computed(() => {
      const data = [...dataSignal()];
      const config = this.state.sortConfig()[sectionKey];

      if (!config?.column) return data;

      return data.sort((a: any, b: any) => {
        const aVal = a[config.column];
        const bVal = b[config.column];

        if (aVal < bVal) return config.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return config.direction === 'asc' ? 1 : -1;
        return 0;
      });
    });
  }

  sortedApplications = this.createSorter(this.state.applications, 'applications');
  sortedRestaurants = this.createSorter(this.state.restaurants, 'restaurants');
  sortedUsers = this.createSorter(this.state.users, 'users');
  sortedOrders = this.createSorter(this.state.orders, 'orders');
  sortedDeliveryAgents = this.createSorter(this.state.deliveryAgents, 'delivery');
}
