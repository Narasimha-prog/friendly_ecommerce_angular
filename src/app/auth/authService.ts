import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, map, Observable, of } from 'rxjs';

import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';

import { AuthApiConfiguration } from '../api/auth/auth-api-configuration';
import { UserApiConfiguration } from '../api/user/user-api-configuration';
import { LocalStorageService } from './local-storage';

import { login, refresh } from '../api/auth/functions';
import { getUserByEmail } from '../api/user/functions';
import { UserResponseDto } from '../api/user/models';
import { AccessTokenResponseDto, AuthenticationResponseDto, RefreshTokenRequestDto } from '../api/auth/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly queryClient = injectQueryClient();
  private readonly localStorage = inject(LocalStorageService);
  
  private readonly authConfig = inject(AuthApiConfiguration);
  private readonly userConfig = inject(UserApiConfiguration);
public readonly notConnected = 'ANONYMOUS_USER';
  private readonly ANONYMOUS_USER: UserResponseDto = { 
    email: 'ANONYMOUS_USER', 
    firstName: 'Guest', 
    roles: [] 
  };

  /**
   * Main Query: This is what components subscribe to.
   */
  public connectedUserQuery = injectQuery(() => ({
    queryKey: ['connected-user'],
    queryFn: () => this.fetchUser(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5 // 5 minutes
  }));

  /**
   * Login: Authenticates and returns the response.
   * Persistence is handled in the Component (or can be moved here).
   */
  logIn(credentials?: any): Observable<AuthenticationResponseDto | null> {
    return login(this.http, this.authConfig.rootUrl, { body: credentials }).pipe(
      map(res => res.body as AuthenticationResponseDto)
    );
  }

  /**
   * CORE LOGIC: Fetches user profile, handles expiry and refresh automatically.
   */
  private async fetchUser(): Promise<UserResponseDto> {

    if (!isPlatformBrowser(this.platformId)) return this.ANONYMOUS_USER;

    const token = this.localStorage.getItem('auth_token');
    const email = this.localStorage.getItem('email');

    if (!token || !email) return this.ANONYMOUS_USER;

    try {
      // 1. Handle Expiry & Refresh
      if (this.isTokenExpired()) {
        const success = await this.tryTokenRefresh();
        if (!success) return this.ANONYMOUS_USER;
      }

      // 2. Fetch User Data
      const res = await firstValueFrom(
        getUserByEmail(this.http, this.userConfig.rootUrl, { email })
      );
      return res.body ?? this.ANONYMOUS_USER;

    } catch (error) {
      this.logOut();
      return this.ANONYMOUS_USER;
    }
  }

  public async tryTokenRefresh(): Promise<boolean> {
    const refreshToken = this.localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const res = await firstValueFrom(
        refresh(this.http, this.authConfig.rootUrl, { 
          body: { refreshToken } 
        }).pipe(map(r => r.body as AccessTokenResponseDto))
      );

      this.saveSession(res);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Session Management Helpers
   */
  public saveSession(data: AccessTokenResponseDto): void {
    if (data.accessToken) this.localStorage.setItem('auth_token', data.accessToken);
    if (data.expiresIn){
      const expireAt = Date.now() + (data.expiresIn * 1000);
            this.localStorage.setItem('token_expire', expireAt.toString());
    }
    if (data.username) {
            this.localStorage.setItem('email', data.username);
          }
  }

  public isTokenExpired(): boolean {
    const expiry = this.localStorage.getItem('token_expire');
    if (!expiry) return true;
    // Expired if current time is within 30 seconds of the stored timestamp
    return Date.now() > (Number(expiry) - 30000);
  }

  public logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      ['auth_token', 'refresh_token', 'token_expire', 'email'].forEach(k => 
        this.localStorage.removeItem(k)
      );
      this.queryClient.setQueryData(['connected-user'], this.ANONYMOUS_USER);
      this.router.navigate(['/login']);
    }
  }

  public hasAnyAuthorities(user: UserResponseDto, authorities: string | string[]): boolean {
    const roles = user?.roles ?? [];
    const required = Array.isArray(authorities) ? authorities : [authorities];
    return roles.some(r => required.includes(r));
  }
}