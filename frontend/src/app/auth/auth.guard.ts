// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check for the token in local storage
  const token = localStorage.getItem('foodnow_token');

  if (token) {
    // User is authenticated, allow access
    return true;
  } else {
    // User is not authenticated, redirect to the login page
    router.navigate(['/login']);
    return false;
  }
};