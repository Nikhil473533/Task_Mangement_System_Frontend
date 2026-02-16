import {inject} from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, catchError } from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated().pipe(
    map(() => true),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};
