import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/payments';

  /**
   * Calls the backend to process a payment for a given order ID.
   * @param orderId The ID of the order to pay for.
   * @returns An observable with the payment result.
   */
processPayment(orderId: number, paymentMethod: string): Observable<any> { // Add paymentMethod here
    const payload = { orderId, paymentMethod }; // Add it to the payload
    return this.http.post(`${this.apiUrl}/process`, payload);
  }
}