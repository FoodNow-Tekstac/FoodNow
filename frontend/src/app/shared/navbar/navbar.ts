import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // Import RouterLinkActive
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink], // Add RouterLinkActive here
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] // Add this line
})
export class NavbarComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}