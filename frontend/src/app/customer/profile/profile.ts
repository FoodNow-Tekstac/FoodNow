// profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ProfileService } from '../../profile/profile';
import { FileService } from '../../shared/services/file';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private fileService = inject(FileService);
  private notificationService = inject(NotificationService);

  // Use the shared profile signal from the service
  profile = this.profileService.profileSignal;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  private backendBaseUrl = 'http://localhost:8080';

  ngOnInit(): void {
    // Only load profile if not already loaded
    if (!this.profile()) {
      this.profileService.getProfile().subscribe({
        error: () => this.notificationService.error('Could not load your profile.')
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];

      // Create a local preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.profile()) return;

    this.notificationService.show('Saving profile...', 'loading');

    // Create a copy of the profile data to modify
    let updatedProfileData = { ...this.profile()! };

    try {
      // Step 1: If a new image was selected, upload it first.
      if (this.selectedImageFile) {
        const uploadResult = await lastValueFrom(this.fileService.upload(this.selectedImageFile));
        if (uploadResult?.filePath) {
          updatedProfileData.profileImageUrl = uploadResult.filePath;
        }
      }

      // Step 2: Update the profile with the new data.
      // This will automatically update the shared signal in the service
      await lastValueFrom(this.profileService.updateProfile(updatedProfileData));

      this.selectedImageFile = null; // Clear the selected file
      this.imagePreviewUrl = null; // Clear the preview

      this.notificationService.success('Profile updated successfully!');
    } catch (error) {
      this.notificationService.error('Failed to update profile.');
    }
  }

  getProfileImageUrl(): string {
    const p = this.profile();
    if (this.imagePreviewUrl) {
      return this.imagePreviewUrl as string;
    }
    if (p?.profileImageUrl) {
      return `${this.backendBaseUrl}${p.profileImageUrl}`;
    }
    return 'https://placehold.co/96x96/1f2937/9ca3af?text=DP';
  }
}