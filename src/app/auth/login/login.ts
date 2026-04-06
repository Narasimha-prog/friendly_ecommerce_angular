import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../authService';
import { AuthenticationResponseDto } from '../../api/auth/models';
import { LocalStorageService } from '../local-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private localStorageService=inject(LocalStorageService);
  private router=inject(Router);

  // Define the form structure
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      
      // Call your backend through the AuthService
      this.authService.logIn(credentials).subscribe({
        next: (response:AuthenticationResponseDto| null) => {
         //  Check for 'access_token' (matching your DTO)
        if (response?.access_token) {
          this.localStorageService.setItem('auth_token', response.access_token);
          
          // If your backend provides a refresh token, store it too
          if (response.refresh_token) {
            this.localStorageService.setItem('refresh_token', response.refresh_token);
          }

          console.log('Login successful for user:', response.username);
          // Redirect to home
          this.router.navigate(['/']);

        } else {
          // This handles the 'null' or 'empty' cases
          console.warn('No access token found in response');
        }
        },
        error: (err) => {
          alert('Invalid credentials!');
        }
      });
    }
  }
}
