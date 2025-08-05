import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// --- INTERFACES for Admin Data ---
export interface PendingApplication {
  id: number;
  restaurantName: string;
  phoneNumber: string;
  applicant: {
    name: string;
    email: string;
  }
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
  private apiUrl = 'http://localhost:8080/api/admin';

  // --- Application Methods ---
  getPendingApplications(): Observable<PendingApplication[]> {
    return this.http.get<PendingApplication[]>(`${this.apiUrl}/applications/pending`);
  }

  approveApplication(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/${id}/approve`, {});
  }

  rejectApplication(id: number, reason: { reason: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/${id}/reject`, reason);
  }
  
  // --- Data Fetching Methods ---
  getAllRestaurants(): Observable<AdminRestaurant[]> {
    return this.http.get<AdminRestaurant[]>(`${this.apiUrl}/restaurants`);
  }
  
  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }
  
  getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders`);
  }
  
  getDeliveryAgents(): Observable<AdminDeliveryAgent[]> {
    return this.http.get<AdminDeliveryAgent[]>(`${this.apiUrl}/delivery-agents`);
  }
  
  createDeliveryAgent(agentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/delivery-personnel`, agentData);
  }
}