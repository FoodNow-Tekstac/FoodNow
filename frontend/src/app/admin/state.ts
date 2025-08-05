import { Injectable, signal } from '@angular/core';

export type AdminSection = 'applications' | 'restaurants' | 'users' | 'orders' | 'delivery' | 'analytics';

@Injectable({
  providedIn: 'root'
})
export class AdminStateService {
  // A signal to hold the currently active section name
  activeSection = signal<AdminSection>('applications');
}