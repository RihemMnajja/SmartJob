import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { Role } from '../models';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/auth/login'], { queryParams: { redirectTo: state.url } });
    }

    if (auth.role() && allowedRoles.includes(auth.role()!)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};
