import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { parseJwt } from '../shared/jwt-utils'; // <-- IMPORT the shared function

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('foodnow_token');

  if (token) {
    const decodedToken = parseJwt(token);
    // This will now work correctly
    const userRoles = decodedToken.roles || []; 
    
    if (userRoles.includes('ROLE_ADMIN')) {
      return true; // Success! User is an admin.
    }
  }
  
  // If no token, or if the token is invalid, or if the role is not admin, redirect to login.
  router.navigate(['/login']);
  return false;
};