import { Component, inject, OnInit } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { UserProfileService } from '../servises/user-profile-service';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { LocalStorageService } from '../../auth/local-storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{

  ngOnInit(): void {
    
  }


  private localStorage=inject(LocalStorageService);
  private userService=inject(UserProfileService);

  private id = this.localStorage.getItem('user_id');


profileQuery = injectQuery(() => ({
   queryKey: ['profile', this.id],
     queryFn: async () => {
    const data = await lastValueFrom(
      this.userService.fetchUserById(this.id!)
    );

    // console.log('Profile data:', data);

    return data;
  },
    enabled: !!this.id
  }));
}
