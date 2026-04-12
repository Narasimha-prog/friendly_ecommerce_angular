import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  // We add the header to bypass the ngrok "browser warning" page
 const platformId = inject(PLATFORM_ID);

  // We only strictly need this bypass when the request comes from a real browser
  if (isPlatformBrowser(platformId)) {
    const modifiedReq = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      }
    });
    return next(modifiedReq);
  }
  return next(req);
};