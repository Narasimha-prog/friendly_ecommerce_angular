import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createPaginationOption, Page, Pagination } from '../../shared/model/request.model';
import { map, Observable } from 'rxjs';
import { createOrder, getAllOrders, getMyOrders, getOrderById } from '../../api/order/functions';
import { OrderApiConfiguration } from '../../api/order/order-api-configuration';
import { OrderDto, OrderResponseDto, PageResponseOrderResponseDto } from '../../api/order/models';
import { StrictHttpResponse } from '../../api/strict-http-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  

  http=inject(HttpClient);
  orderConfig=inject(OrderApiConfiguration);

  /**
   * Creates a new order in the Order Microservice
   */
  create(body: OrderDto): Observable<OrderResponseDto> {
    return createOrder(this.http, this.orderConfig.rootUrl, { body }).pipe(
      // We map the StrictHttpResponse to just the body for easier use in mutations
      map(res => res.body as OrderResponseDto)
    );
  }

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

  getOrderById(orderId:string){
    return getOrderById(this.http,this.orderConfig.rootUrl,{orderId})
    .pipe(
      map((response)=>response.body)
    )
  }
}
