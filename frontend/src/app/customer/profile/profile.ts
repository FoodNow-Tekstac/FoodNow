import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ProfileService } from '../../profile/profile';
import { FileService } from '../../shared/services/file';
import { NotificationService } from '../../shared/notification';
import { FullUrlPipe } from '../../shared/pipes/full-url';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FullUrlPipe],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private fileService = inject(FileService);
  private notificationService = inject(NotificationService);

  profile = this.profileService.profileSignal;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  
  // --- Logic for the image view modal ---
  isViewModalVisible = signal(false);
  
  openViewModal(): void {
    if (this.profile()?.profileImageUrl || this.imagePreviewUrl) {
      this.isViewModalVisible.set(true);
    }
  }

  closeViewModal(): void {
    this.isViewModalVisible.set(false);
  }
  // --- END ---

  ngOnInit(): void {
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
    let updatedProfileData = { ...this.profile()! };

    try {
      if (this.selectedImageFile) {
        const uploadResult = await lastValueFrom(this.fileService.upload(this.selectedImageFile));
        if (uploadResult?.filePath) {
          updatedProfileData.profileImageUrl = uploadResult.filePath;
        }
      }
      await lastValueFrom(this.profileService.updateProfile(updatedProfileData));
      this.selectedImageFile = null;
      this.imagePreviewUrl = null;
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
    // Return the raw path; the FullUrlPipe in the template will handle the rest
    if (p?.profileImageUrl) {
      return p.profileImageUrl;
    }
    return 'https://placehold.co/96x96/1f2937/9ca3af?text=DP';
  }
}