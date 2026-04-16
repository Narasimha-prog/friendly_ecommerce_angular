import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from './local-storage';
import { inject } from '@angular/core';
import { AuthService } from './authService';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);

  // 1. Skip Auth-related calls to avoid infinite loops
  if (req.url.includes('/auth/refresh') || req.url.includes('/auth/login')) {
    return next(req);
  }

  // 2. The "Solid" Check
  // We check the clock. If it's expired (or within 30s of expiring)...
  if (authService.isTokenExpired()) {
    // We pause this request, refresh the token, then continue
    return from(authService.tryTokenRefresh()).pipe(
      switchMap(() => {
        const token = localStorageService.getItem('auth_token');
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(authReq);
      })
    );
  }

  // 3. Normal Request (Token is still valid)
  const token = localStorageService.getItem('auth_token');
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq);
};
