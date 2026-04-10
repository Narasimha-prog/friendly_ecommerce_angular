import { inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { AuthApiConfiguration } from '../api/auth/auth-api-configuration';
import { LocalStorageService } from './local-storage';
import { HttpClient } from '@angular/common/http';
import { login, refresh } from '../api/auth/functions';
import { UserRequestDto, UserResponseDto } from '../api/user/models';
import { createUser, getUserByEmail, getUserById } from '../api/user/functions';
import { UserApiConfiguration } from '../api/user/user-api-configuration';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthenticationResponseDto } from '../api/auth/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


private http = inject(HttpClient);
 private authConfig = inject(AuthApiConfiguration);
 private userConfig=inject(UserApiConfiguration);
 private localStorageService=inject(LocalStorageService);
 private platformId=inject(PLATFORM_ID);
private injector = inject(Injector);
public notConnected = 'ANONYMOUS_USER';


private readonly guestUser: UserResponseDto = {
  email: this.notConnected, // 'ANONYMOUS_USER'
  firstName: 'Guest',
  lastName: '',
  roles: [] // Empty array means they can't see Admin/Seller menus
};

 logIn(credentials?: any) : Observable<AuthenticationResponseDto | null>{
    if (!credentials) {
      this.router.navigate(['/users/login']);
      return of(null);
    }
    return login(this.http, this.authConfig.rootUrl, { body: credentials }).pipe(
    // 2. We use map to "Unpack" the Box and just return the Letter (body)
    map(response => response.body as AuthenticationResponseDto)
  );

  }

 fetch() {
    return this.connectedUserQuery;

  }
private get router() {
    return this.injector.get(Router);
  }

     private async fetchUser(): Promise<UserResponseDto> {

    if (isPlatformBrowser(this.platformId)) {

      const token = this.localStorageService.getItem('auth_token');

      if (!token) return this.guestUser;

      try {
        //decode
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      this.logOut();        // Clears everything if expired
      return this.guestUser;
    }
   
      //call using user id
      const response = await firstValueFrom(
        getUserById(this.http, this.userConfig.rootUrl, { id: decoded.sub })
      );
  
      //send response
      return response.body ?? this.guestUser;// Returns UserResponseDto with firstName, etc.
      
    } catch (err) {
        return this.guestUser;
      }
    }
    return { email: this.notConnected, roles: [] };
  }

 

 public connectedUserQuery = injectQuery(() => ({
    queryKey: ['connected-user'],
    queryFn: () => this.fetchUser(),
  }));


  logOut() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      // Force a reload to clear all TanStack queries and reset UI
      window.location.href = '/';
    }
  }
hasAnyAuthorities(user: UserResponseDto, authorities: string[] | string): boolean {
    if (!user || !user.roles || user.email === this.notConnected) return false;
    const authArray = Array.isArray(authorities) ? authorities : [authorities];
    return user.roles.some((role: string) => authArray.includes(role));
  }
  
  
  
}

