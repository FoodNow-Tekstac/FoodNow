import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { RestaurantDashboardService, MenuItemPayload } from '../dashboard';
import { FileService } from '../../shared/services/file';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-menu-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-item-modal.html',
  styleUrls: ['./menu-item-modal.css']
})
export class MenuItemModalComponent implements OnInit {
  @Input() menuItem: any | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private dashboardService = inject(RestaurantDashboardService);
  private fileService = inject(FileService);
  private notificationService = inject(NotificationService);

  isEditMode = false;
  modalTitle = 'Add New Item';
  itemData: MenuItemPayload = this.getEmptyForm();
  selectedImageFile: File | null = null;

  ngOnInit(): void {
    if (this.menuItem) {
      this.isEditMode = true;
      this.modalTitle = 'Edit Item';
      this.itemData = { ...this.menuItem };
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImageFile = input.files[0];
    }
  }

  async onSubmit(): Promise<void> {
    //this.notificationService.show('Saving item...', 'loading');
    let submissionData = { ...this.itemData };

    try {
      if (this.selectedImageFile) {
        const uploadResult = await lastValueFrom(this.fileService.upload(this.selectedImageFile));
        if (uploadResult?.filePath) {
          submissionData.imageUrl = uploadResult.filePath;
        }
      }

      if (this.isEditMode) {
        await lastValueFrom(this.dashboardService.updateMenuItem(this.itemData.id!, submissionData));
      } else {
        await lastValueFrom(this.dashboardService.addMenuItem(submissionData));
      }

      this.notificationService.success(`Item ${this.isEditMode ? 'updated' : 'added'}!`);
      this.save.emit();
    } catch (error) {
      this.notificationService.error('Failed to save item.');
    }
  }

  private getEmptyForm(): MenuItemPayload {
    return { name: '', description: '', price: 0, category: '', dietaryType: '' };
  }
}