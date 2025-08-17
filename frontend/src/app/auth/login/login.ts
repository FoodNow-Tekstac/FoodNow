import {
  Component,
  OnInit,
  inject,
  signal,
  effect,
  ViewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cart, CartService } from '../../cart/cart';
import { OrderService } from '../../order/order';
import { NotificationService } from '../../shared/notification';

import qrcode from 'qrcode-generator';
import { AuthService } from '../auth';

// Enhanced Receipt Interface
interface ReceiptData {
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  deliveryAddress: {
    addressLine1: string;
    city: string;
    pinCode: string;
  };
  paymentMethod: string;
  paymentDetails?: string;
  items: any[];
  totalPrice: number;
  taxAmount: number;
  finalAmount: number;
}

// Custom Validator for Expiry Date
export function expiryDateValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) return null;
  const [month, year] = control.value.split('/');
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return {
      invalidFormat: true,
    };
  }
  const expiryMonth = Number(month);
  const expiryYear = Number(`20${year}`);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (
    expiryYear < currentYear ||
    (expiryYear === currentYear && expiryMonth < currentMonth)
  ) {
    return {
      expired: true,
    };
  }
  return null;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal(false);
  isRegisterMode = signal(false);
  hidePassword = signal(true);

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      // Name: only letters, no spaces, no numbers
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z]+$/), // Only English letters, no spaces/numbers
          // For all languages, use: /^[\p{L}]+$/u
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      // Indian phone numbers: starts with 6,7,8,9 and exactly 10 digits
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get loginEmail() {
    return this.loginForm.get('email');
  }
  get loginPassword() {
    return this.loginForm.get('password');
  }
  get registerName() {
    return this.registerForm.get('name');
  }
  get registerEmail() {
    return this.registerForm.get('email');
  }
  get registerPhone() {
    return this.registerForm.get('phoneNumber');
  }
  get registerPassword() {
    return this.registerForm.get('password');
  }

  toggleMode(event: Event): void {
    event.preventDefault();
    this.isRegisterMode.update((value) => !value);
    this.resetForms();
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  private resetForms(): void {
    this.loginForm.reset();
    this.registerForm.reset();
    // this.registerForm.patchValue({ email: 'admin@foodnow.com' });
  }

  onLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      error: (err) => {
        this.notificationService.show(
          err.error?.message || 'Login failed. Please try again.',
          'error'
        );
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  onRegister(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;
    this.isLoading.set(true);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        // this.notificationService.show(
        //   'Registration successful! Please log in with your credentials.',
        //   'success'
        // );
        this.isRegisterMode.set(false);
        this.resetForms();
      },
      error: (err) => {
        this.notificationService.show(
          err.error?.message || 'Registration failed. Please try again.',
          'error'
        );
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (control?.hasError('required')) return `${fieldName} is required.`;
    if (control?.hasError('email'))
      return 'Please enter a valid email address.';
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters.`;
    }
    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength']?.requiredLength;
      return `${fieldName} must be less than ${requiredLength} characters.`;
    }
    if (control?.hasError('pattern')) {
      if (fieldName === 'Full Name')
        return 'Name must contain only letters without spaces or numbers.';
      if (fieldName === 'Phone Number')
        return 'Enter a valid 10-digit Indian number starting with 6, 7, 8, or 9.';
      return 'Invalid format.';
    }
    return '';
  }
}