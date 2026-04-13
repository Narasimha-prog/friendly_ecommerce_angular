import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { catchError, filter, map, of, take, timeout } from 'rxjs';
import { AuthService } from './authService';
import { toObservable } from '@angular/core/rxjs-interop';

export const roleCheckGuard: CanActivateFn = (
  next, state

) => {

  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
    if (!isPlatformBrowser(platformId)) return true;


    const authorities = next.data['authorities'];
    return toObservable(authService.connectedUserQuery.status).pipe(
      filter(() => authService.connectedUserQuery?.isPending() == false),
      map(() => authService.connectedUserQuery?.data()),
     map(data => {
      const hasAccess = !authorities || 
                        authorities.length === 0 || 
                        authService.hasAnyAuthorities(data!, authorities);

      if (hasAccess) return true;

      //  REDIRECT: Send them to login and remember where they wanted to go
      router.navigate(['/users/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }),
      take(1),
      timeout(3000),
      catchError(() => {
        router.navigate(['/users/login']);
        return of(false);
    })
    )
};