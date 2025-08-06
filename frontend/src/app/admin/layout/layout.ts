import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { AdminStateService } from '../state';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class AdminLayoutComponent {
  protected authService = inject(AuthService);
  protected state = inject(AdminStateService);

  logout() {
    this.authService.logout();
  }
}