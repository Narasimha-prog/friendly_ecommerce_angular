import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserApiConfiguration } from '../../api/user/user-api-configuration';
import { getUserById } from '../../api/user/fn/users/get-user-by-id';
import { UserResponseDto } from '../../api/user/models';
import { StrictHttpResponse } from '../../api/strict-http-response';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  private http=inject(HttpClient);

  private userApiConfig=inject(UserApiConfiguration);


   public  fetchUserById(id:string):Observable<UserResponseDto>{

    return getUserById(this.http,this.userApiConfig.rootUrl,{id}).pipe(
          map((response:StrictHttpResponse<UserResponseDto>) => response.body)
        )
    
  }

 
  
}
