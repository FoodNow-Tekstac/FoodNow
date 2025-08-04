import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-confirmation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forgot-password-confirmation.html',
})
export class ForgotPasswordConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  resetLink = signal('');

  ngOnInit(): void {
    // Read the 'link' query parameter from the URL
    const link = this.route.snapshot.queryParamMap.get('link');
    this.resetLink.set(link || 'No reset link found.');
  }
}