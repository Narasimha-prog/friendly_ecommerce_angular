import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { LocalStorageService } from './auth/local-storage';
import { provideQueryClient, QueryClient } from '@tanstack/angular-query-experimental';
import { authInterceptor } from './auth/auth-interceptor';
import { provideAuthApiConfiguration } from './api/auth/auth-api-configuration';
import { provideProductApiConfiguration } from './api/product/product-api-configuration';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),

    provideBrowserGlobalErrorListeners(),

     provideZonelessChangeDetection(),

    provideRouter(appRoutes,withComponentInputBinding()),

    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),

    provideQueryClient(new QueryClient()),
     LocalStorageService,
    //  provideAuthApiConfiguration('https://2948-2409-40f0-9-315-94d8-3c53-c0a0-a3dc.ngrok-free.app'),
    // provideProductApiConfiguration('https://2948-2409-40f0-9-315-94d8-3c53-c0a0-a3dc.ngrok-free.app')
  ],

  
};
