import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../components/auth/service/auth.service';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateChildFn = (childRoute, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  return service.isAuthenticated().pipe(
    map(authenticated => {
      if (authenticated) {
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    }),
    catchError(error => {
      router.navigate(['']);
      return of(false);
    })
  );
};
