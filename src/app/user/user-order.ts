import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { OrderService } from '../shared/service/order-service';
import { Pagination } from '../shared/model/request.model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { OrderedItems } from '../shared/model/order.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-user-order',
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './user-order.html',
  styleUrl: './user-order.scss',
})
export class UserOrder {

  orderService=inject(OrderService);

  pageRequest:Pagination={
    page:0,
    size:20,
    sort:[]
  }

  platformId=inject(PLATFORM_ID);

  orderQuery=injectQuery(()=>({
    queryKey:['user-orders',this.pageRequest],
    queryFn: ()=>lastValueFrom(this.orderService.getOrderForConnectedUser(this.pageRequest))
  }))


  computeItemName(items:OrderedItems[]){
       return items.map(item=>item.name).join(', ');
  }

  computeItemQuantity(items:OrderedItems[]){
       return items.reduce((acc,item)=>acc+item.quantity,0);
  }

  computeTotal(items:OrderedItems[]){
    return items.reduce((acc,item)=>acc+item.quantity*item.price,0);
  }

  checkIfPlatFormBrowser():boolean{
    return isPlatformBrowser(this.platformId);
  }
}
