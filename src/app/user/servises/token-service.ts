import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getUserId(token: string): string | null {
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
}
