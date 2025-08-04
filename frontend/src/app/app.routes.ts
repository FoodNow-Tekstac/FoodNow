// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './auth/auth.guard';
import { AuthenticatedLayoutComponent } from './layouts/authenticated/authenticated';
import { CustomerDashboardComponent } from './customer/dashboard/dashboard';
import { CartComponent } from './customer/cart/cart'; // Import CartComponent
import { OrdersComponent } from './customer/orders/orders'; // Import OrdersComponent
import { RestaurantDetailComponent } from './customer/restaurant-detail/restaurant-detail';
import { TrackOrderComponent } from './customer/track-order/track-order';
import { ReviewComponent } from './customer/review/review';
import { ProfileComponent } from './customer/profile/profile';
import { BecomePartnerComponent } from './customer/become-partner/become-partner';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ForgotPasswordConfirmationComponent } from './auth/forgot-password-confirmation/forgot-password-confirmation';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { PaymentComponent } from './customer/payment/payment';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // ✅ PUBLICLY ACCESSIBLE ROUTES
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password-confirmation', component: ForgotPasswordConfirmationComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // ✅ CUSTOMER ROUTES (require login)
  {
    path: 'customer',
    component: AuthenticatedLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'cart', component: CartComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'restaurant/:id', component: RestaurantDetailComponent },
      { path: 'track-order/:orderId', component: TrackOrderComponent },
      { path: 'review/:orderId', component: ReviewComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'become-a-partner', component: BecomePartnerComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'payment', component: PaymentComponent },

    ]
  },

  // ✅ DEFAULT & WILDCARD
  { path: '', redirectTo: '/customer/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
