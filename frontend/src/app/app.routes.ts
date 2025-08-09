// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './auth/auth.guard';
import { restaurantGuard } from './auth/restaurant.guard';

import { AuthenticatedLayoutComponent } from './layouts/authenticated/authenticated';
import { RestaurantLayoutComponent } from './restaurant/layout/layout';

import { CustomerDashboardComponent } from './customer/dashboard/dashboard';
import { CartComponent } from './customer/cart/cart';
import { OrdersComponent } from './customer/orders/orders';
import { RestaurantDetailComponent } from './customer/restaurant-detail/restaurant-detail';
import { TrackOrderComponent } from './customer/track-order/track-order';
import { ReviewComponent } from './customer/review/review';
import { ProfileComponent } from './customer/profile/profile';
import { BecomePartnerComponent } from './customer/become-partner/become-partner';
import { PaymentComponent } from './customer/payment/payment';

import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';

import { RestaurantOverviewComponent } from './restaurant/overview/overview';
import { RestaurantOrdersComponent } from './restaurant/orders/orders';
import { RestaurantReviewsComponent } from './restaurant/reviews/reviews';
import { RestaurantMenuComponent } from './restaurant/menu/menu';
import { adminGuard } from './auth/admin.guard';
import { AdminLayoutComponent } from './admin/layout/layout';
import { AdminPageComponent } from './admin/page/page';

export const routes: Routes = [
  // ✅ PUBLIC ROUTES
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // ✅ CUSTOMER ROUTES
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
      { path: 'payment', component: PaymentComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ✅ RESTAURANT ROUTES
  {
    path: 'restaurant',
    component: RestaurantLayoutComponent,
    canActivate: [restaurantGuard],
    children: [
      { path: 'overview', component: RestaurantOverviewComponent },
      { path: 'dashboard', redirectTo: 'overview', pathMatch: 'full' }, // ✅ fix route alias
      { path: 'orders', component: RestaurantOrdersComponent },
      { path: 'menu', component: RestaurantMenuComponent },
      { path: 'reviews', component: RestaurantReviewsComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard], // Protect this whole section with the admin guard
    children: [
      { path: ':section', component: AdminPageComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  },

  // ✅ DEFAULT & FALLBACK
  { path: '', redirectTo: '/customer/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
