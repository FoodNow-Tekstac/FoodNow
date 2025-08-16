import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../auth';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  isLoading = signal(false);
  isRegisterMode = signal(false);
  hidePassword = signal(true);

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
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
    //this.registerForm.patchValue({ email: 'admin@foodnow.com' });
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
        this.notificationService.show(
          'Registration successful! Please log in with your credentials.',
          'success'
        );
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

  getErrorMessage(control: any, fieldName: string): string {
    if (control?.hasError('required')) return `${fieldName} is required.`;
    if (control?.hasError('email'))
      return 'Please enter a valid email address.';
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters.`;
    }
    if (control?.hasError('pattern')) {
      return fieldName === 'Phone Number'
        ? 'Please enter a valid 10-digit phone number.'
        : 'Invalid format.';
    }
    return '';
  }
}
