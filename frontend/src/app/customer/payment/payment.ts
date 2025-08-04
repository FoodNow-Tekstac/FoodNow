import { Component, OnInit, signal, inject, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Cart, CartService } from '../../cart/cart';
import { OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';
import qrcode from 'qrcode-generator'; // Import the QR code library

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  cart = signal<Cart | null>(null);
  selectedPaymentMethod = signal('card');

  // This gets a reference to the #qrCodeContainer element in our HTML
  @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef<HTMLDivElement>;

  constructor() {
    // This effect will run whenever the selected payment method changes
    effect(() => {
      if (this.selectedPaymentMethod() === 'upi' && this.cart()) {
        this.generateQRCode();
      }
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (data) => this.cart.set(data),
      error: () => this.notificationService.error('Could not load your cart summary.')
    });
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod.set(method);
  }

  generateQRCode(): void {
    // We need a short delay to ensure the div is visible in the DOM before we draw on it
    setTimeout(() => {
      if (this.qrCodeContainer) {
        const container = this.qrCodeContainer.nativeElement;
        container.innerHTML = ''; // Clear previous QR code

        // Mock UPI string, using the actual total price from the cart
        const totalPrice = (this.cart()!.totalPrice * 1.05).toFixed(2);
        const upiString = `upi://pay?pa=foodnow-demo@paytm&pn=FoodNow&am=${totalPrice}&cu=INR`;

        const qr = qrcode(0, 'M');
        qr.addData(upiString);
        qr.make();

        container.innerHTML = qr.createImgTag(5, 10); // size 5, margin 10
        const img = container.querySelector('img');
        if (img) {
            img.style.backgroundColor = 'white';
            img.style.borderRadius = '8px';
        }
      }
    }, 0);
  }

  onPlaceOrder(): void {
    this.notificationService.show('Placing your order...', 'loading');
    this.orderService.placeOrder().subscribe({
      next: () => {
        this.notificationService.success('Order placed successfully!');
        // Reset cart item count
        this.cartService.getCart().subscribe(); 
        setTimeout(() => {
          this.router.navigate(['/customer/orders']);
        }, 1500);
      },
      error: () => this.notificationService.error('Could not place your order.')
    });
  }
}