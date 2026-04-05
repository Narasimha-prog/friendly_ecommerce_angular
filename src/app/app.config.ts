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

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),

    provideBrowserGlobalErrorListeners(),

     provideZonelessChangeDetection(),

    provideRouter(appRoutes,withComponentInputBinding()),

    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),

    provideQueryClient(new QueryClient()),
     LocalStorageService
  ],
  
};
