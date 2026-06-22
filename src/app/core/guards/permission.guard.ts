import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredModule = route.data['requiredModule'];
  const requiredPrivilege = route.data['requiredPrivilege'];

  // 2. Check using our new Enterprise Permission Checker
  if (authService.hasAccess(requiredModule, requiredPrivilege)) {
    return true; // Let them in
  } else {
    // Logged in, but unauthorized for this specific page
    console.warn(`Access Denied: Missing ${requiredPrivilege} on ${requiredModule}`);
    router.navigate(['/app/dashboard']); 
    return false;
  }
};
