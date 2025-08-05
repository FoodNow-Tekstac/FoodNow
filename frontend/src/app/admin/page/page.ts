import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService, PendingApplication } from '../admin';
import { NotificationService } from '../../shared/notification';
import { AdminStateService, AdminSection } from '../state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './page.html',
})
export class AdminPageComponent implements OnInit {
  // --- Service Injection ---
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);
  protected state = inject(AdminStateService);

  // --- Component State ---
  tableData = signal<any[]>([]);
  pageTitle = signal('');
  isAgentModalOpen = signal(false);
  newAgentForm = this.getEmptyAgentForm();
  
  constructor() {
    // This effect runs automatically whenever the active section changes
    effect(() => {
      this.fetchDataForSection(this.state.activeSection());
    });
  }

  ngOnInit(): void {
    // Listen to URL changes to set the active section from the route parameter
    this.route.paramMap.subscribe(params => {
      const section = params.get('section') as AdminSection;
      if (section) {
        this.state.activeSection.set(section);
      }
    });
  }

  fetchDataForSection(section: AdminSection): void {
    this.tableData.set([]); // Clear previous data to show a loading state
    let dataObservable: Observable<any[]>; // Use a single type here

    switch (section) {
      case 'applications':
        this.pageTitle.set('Pending Restaurant Applications');
        dataObservable = this.adminService.getPendingApplications();
        break;
      case 'restaurants':
        this.pageTitle.set('All Restaurants');
        dataObservable = this.adminService.getAllRestaurants();
        break;
      case 'users':
        this.pageTitle.set('All Users');
        dataObservable = this.adminService.getAllUsers();
        break;
      case 'orders':
        this.pageTitle.set('All Orders');
        dataObservable = this.adminService.getAllOrders();
        break;
      case 'delivery':
        this.pageTitle.set('Delivery Agents');
        dataObservable = this.adminService.getDeliveryAgents();
        break;
      default:
        this.pageTitle.set('Dashboard');
        return;
    }

dataObservable.subscribe({
      next: (data: any[]) => this.tableData.set(data),
      error: (err: any) => this.notificationService.error(err.error?.message || 'Failed to load data.')
    });
  }
  
  // --- Action Methods ---
  approve(app: PendingApplication): void {
    this.adminService.approveApplication(app.id).subscribe({
      next: () => {
        this.notificationService.success(`Approved ${app.restaurantName}.`);
        this.fetchDataForSection('applications');
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
          this.fetchDataForSection('applications');
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
    this.notificationService.show('Creating agent...', 'loading');
    this.adminService.createDeliveryAgent(this.newAgentForm).subscribe({
      next: () => {
        this.notificationService.success('Agent created successfully!');
        this.closeAgentModal();
        this.fetchDataForSection('delivery');
      },
      error: (err) => this.notificationService.error(err.error?.message || 'Failed to create agent.')
    });
  }

  private getEmptyAgentForm() {
    return { name: '', email: '', phoneNumber: '', password: '' };
  }
}