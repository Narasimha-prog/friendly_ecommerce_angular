import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createPaginationOption, Page, Pagination } from '../../shared/model/request.model';
import { map, Observable } from 'rxjs';
import { getAllOrders, getMyOrders } from '../../api/order/functions';
import { OrderApiConfiguration } from '../../api/order/order-api-configuration';
import { PageResponseOrderResponseDto } from '../../api/order/models';
import { StrictHttpResponse } from '../../api/strict-http-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  

  http=inject(HttpClient);
  orderConfig=inject(OrderApiConfiguration);

  getOrderForConnectedUser(pageRequest:Pagination): Observable<PageResponseOrderResponseDto>{
       

  return getMyOrders(this.http,this.orderConfig.rootUrl,pageRequest).pipe(
    map((response:StrictHttpResponse<PageResponseOrderResponseDto>) => response.body)
  );
  }

   getOrderForAdmin(pageRequest:Pagination): Observable<PageResponseOrderResponseDto>{

      return getAllOrders(this.http,this.orderConfig.rootUrl,pageRequest).pipe(
        map((response:StrictHttpResponse<PageResponseOrderResponseDto>)=> response.body)
      );
  }
}
