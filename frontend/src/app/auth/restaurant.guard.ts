import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// This is our JWT parsing function from auth.ts
function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) { return {}; }
}

export const restaurantGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('foodnow_token');

  if (token) {
    const decodedToken = parseJwt(token);
    const userRoles = decodedToken.roles || [];

    if (userRoles.includes('ROLE_RESTAURANT_OWNER')) {
      return true; // Access granted
    }
  }

  // If no token or wrong role, redirect to the main customer dashboard
  router.navigate(['/customer/dashboard']);
  return false;
};