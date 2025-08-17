// navbar.component.ts
import { Component, inject, OnInit, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { ProfileService } from '../../profile/profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  
  // Use the shared profile signal from the service
  profile = this.profileService.profileSignal;
  private backendBaseUrl = 'http://localhost:8080';

  // Computed property for profile image URL that updates automatically
  profileImageUrl = computed(() => {
    const p = this.profile();
    if (p?.profileImageUrl) {
      return `${this.backendBaseUrl}${p.profileImageUrl}`;
    }
    return 'https://placehold.co/40x40/1f2937/9ca3af?text=DP';
  });

  ngOnInit(): void {
    // Only load profile if not already loaded
    if (!this.profile()) {
      this.profileService.getProfile().subscribe({
        error: (error) => console.error('Could not load profile for navbar:', error)
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}