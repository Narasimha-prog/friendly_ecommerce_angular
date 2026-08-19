import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
 import { UserRequestDto } from '../../api/user/models/user-request-dto'; // Adjust path
import { AuthService } from '../authService';
import { COUNTRY_LIST } from '../../user/model/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  showPassword = signal<boolean>(false);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authenticationService=inject(AuthService)
  protected readonly countries = COUNTRY_LIST;




  // 1. Setup the Mutation
  registerMutation = injectMutation(() => ({
    mutationFn: (userData: UserRequestDto) => 
      lastValueFrom(this.authenticationService.register(userData)),
    onSuccess: () => {
      alert('Registration successful! Please login.');
      this.router.navigate(['/login']);
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
      alert(error.error?.message || 'Failed to register. Please try again.');
    }
  }));

  // 2. Setup the Form
  
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    countryCode: [this.countries[0].code, Validators.required],
    dialCode: [this.countries[0].dialCode, Validators.required],
  phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{7,12}$')]],
    addressStreet: [''],
    addressCity: [''],
    addressZipCode: [''],
    addressCountry: [''],
    roles: [['USER']]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Concatenate dialCode + phoneNumber to match UserRequestDto
      const payload: UserRequestDto = {
        email: formValue.email!,
        password: formValue.password!,
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        countryCode: formValue.countryCode!,
        phoneNumber: `${formValue.dialCode}${formValue.phoneNumber}`,
        addressStreet: formValue.addressStreet || '',
        addressCity: formValue.addressCity || '',
        addressZipCode: formValue.addressZipCode || '',
        addressCountry: formValue.addressCountry || '',
        roles: ['USER']
      };

      this.registerMutation.mutate(payload);
    }
  }

  //for password 
  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }
}