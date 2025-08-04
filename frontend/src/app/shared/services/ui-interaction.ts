// src/app/shared/services/ui-interaction.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiInteractionService {
  // A Subject is like an event emitter. Components can trigger it and listen to it.
  private openPartnerModalSource = new Subject<void>();

  // An Observable that components can subscribe to, to be notified of the event.
  openPartnerModal$ = this.openPartnerModalSource.asObservable();

  // The method that the Navbar will call to trigger the event.
  triggerOpenPartnerModal() {
    this.openPartnerModalSource.next();
  }
}