import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from './local-storage';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem('auth_token');

  // If token exists, clone request and add Header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // If no token, just pass the original request
  return next(req);
};
