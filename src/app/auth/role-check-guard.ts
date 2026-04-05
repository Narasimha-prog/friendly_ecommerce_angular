import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { filter, interval, map, timeout } from 'rxjs';
import { AuthService } from './authService';

export const roleCheckGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const authorities = next.data['authorities'];
    return interval(50).pipe(
      filter(() => authService.connectedUserQuery?.isPending() == false),
      map(() => authService.connectedUserQuery?.data()),
      map(
        (data) =>
          !authorities ||
          authorities.length === 0 ||
          authService.hasAnyAuthorities(data!, authorities)
      ),
      timeout(3000)
    );
  } else {
    return false;
  }
};