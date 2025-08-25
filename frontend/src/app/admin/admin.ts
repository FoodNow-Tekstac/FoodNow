import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, tap } from 'rxjs';
import { AdminStateService } from './state';

// --- INTERFACES ---
export interface PendingApplication {
  id: number;
  restaurantName: string;
  phoneNumber: string;
  address: string;      
  businessId: string;
  applicant: {
    name: string;
    email: string;
  };
}

export interface AdminRestaurant {
  id: number;
  name: string;
  address: string;
  ownerName: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface AdminOrder {
  id: number;
  customerName: string;
  restaurantName: string;
  totalPrice: number;
  status: string;
  reviewRating?: number;
  orderTime: string;
}

export interface AdminDeliveryAgent {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}



@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private state = inject(AdminStateService);
  private apiUrl = 'http://localhost:8080/api/admin';

  // --- Fetch and Sync All Admin Data into State ---
  fetchAllData(): Observable<any> {
    return forkJoin({
      applications: this.getPendingApplications(),
      restaurants: this.getAllRestaurants(),
      users: this.getAllUsers(),
      orders: this.getAllOrders(),
      deliveryAgents: this.getDeliveryAgents()
    }).pipe(
      tap(results => {
        this.state.applications.set(results.applications);
        this.state.restaurants.set(results.restaurants);
        this.state.users.set(results.users);
        this.state.orders.set(results.orders);
        this.state.deliveryAgents.set(results.deliveryAgents);
      })
    );
  }

  // --- Refresh One Section Only ---
  fetchDataForSection(section: 'applications' | 'delivery'): Observable<any> {
    switch (section) {
      case 'applications':
        return this.getPendingApplications().pipe(
          tap(data => this.state.applications.set(data))
        );
      case 'delivery':
        return this.getDeliveryAgents().pipe(
          tap(data => this.state.deliveryAgents.set(data))
        );
      default:
        return new Observable(sub => sub.complete()); // No-op fallback
    }
  }

  // --- Action Methods ---
  approveApplication(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/${id}/approve`, {});
  }

  rejectApplication(id: number, reason: { reason: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/${id}/reject`, reason);
  }

  createDeliveryAgent(agentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/delivery-personnel`, agentData);
  }

  // --- Private Data Fetching Methods ---
  private getPendingApplications(): Observable<PendingApplication[]> {
    return this.http.get<PendingApplication[]>(`${this.apiUrl}/applications/pending`);
  }

  private getAllRestaurants(): Observable<AdminRestaurant[]> {
    return this.http.get<AdminRestaurant[]>(`${this.apiUrl}/restaurants`);
  }

  private getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  private getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders`);
  }

  private getDeliveryAgents(): Observable<AdminDeliveryAgent[]> {
    return this.http.get<AdminDeliveryAgent[]>(`${this.apiUrl}/delivery-agents`);
  }
}
