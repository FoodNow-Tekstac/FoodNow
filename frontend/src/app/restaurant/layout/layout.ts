import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardData, RestaurantDashboardService } from '../dashboard';
import { AuthService } from '../../auth/auth';
import { FullUrlPipe } from '../../shared/pipes/full-url';
import { NotificationService } from '../../shared/notification';
import { lastValueFrom } from 'rxjs';
import { RestaurantService } from '../restaurant';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FullUrlPipe],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class RestaurantLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dashboardService = inject(RestaurantDashboardService);
  private restaurantService = inject(RestaurantService);
  private notificationService = inject(NotificationService);

  // --- MODAL LOGIC ---
  isUploadModalVisible = signal(false);
  isViewModalVisible = signal(false); // New signal for the view modal
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  // --- END OF MODAL LOGIC ---

  restaurantData: WritableSignal<DashboardData | null> = this.dashboardService.dashboardData;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- METHODS FOR UPLOAD MODAL ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => { this.imagePreviewUrl = reader.result; };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  async handleImageUpdate(): Promise<void> {
    if (!this.selectedImageFile) {
      this.notificationService.show('Please select an image first.');
      return;
    }
    try {
      this.notificationService.show('Uploading and saving...', 'loading');
      const updatedRestaurant = await lastValueFrom(this.restaurantService.uploadRestaurantImage(this.selectedImageFile));
      
      const currentData = this.dashboardService.dashboardData();
      if (currentData) {
        const newData = { ...currentData };
        newData.restaurantProfile.imageUrl = updatedRestaurant.imageUrl;
        this.dashboardService.dashboardData.set(newData);
      }

      this.notificationService.success('Profile picture updated successfully!');
      this.closeUploadModal();
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      this.notificationService.error('Update failed. Please try again.');
    }
  }

  openUploadModal(): void {
    this.isUploadModalVisible.set(true);
  }

  closeUploadModal(): void {
    this.isUploadModalVisible.set(false);
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  // --- NEW METHODS FOR VIEW MODAL ---
  openViewModal(): void {
    if (this.restaurantData()?.restaurantProfile.imageUrl) {
        this.isViewModalVisible.set(true);
    }
  }
  
  closeViewModal(): void {
    this.isViewModalVisible.set(false);
  }
}