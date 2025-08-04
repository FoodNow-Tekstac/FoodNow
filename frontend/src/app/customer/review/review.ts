import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './review.html',
  styleUrl: './review.css' // Link to our new CSS file
})
export class ReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  orderId: string = '';
  rating: number = 0;
  comment: string = '';

  ngOnInit(): void {
    // Get the orderId from the URL
    this.orderId = this.route.snapshot.paramMap.get('orderId')!;
  }

  onSubmit(): void {
    if (this.rating === 0) {
      this.notificationService.error('Please select a star rating.');
      return;
    }

    this.notificationService.show('Submitting your review...', 'loading');

    const reviewPayload = {
      rating: this.rating,
      comment: this.comment
    };

    this.orderService.submitReview(this.orderId, reviewPayload).subscribe({
      next: () => {
        this.notificationService.success('Thank you for your feedback!');
        // Navigate back to the orders page after a short delay
        setTimeout(() => {
          this.router.navigate(['/customer/orders']);
        }, 2000);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Failed to submit review.');
      }
    });
  }
}