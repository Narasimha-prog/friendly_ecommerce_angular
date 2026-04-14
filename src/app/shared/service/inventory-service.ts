import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryApiConfiguration } from '../../api/inventory/inventory-api-configuration';
import { getInventory } from '../../api/inventory/functions';
import { map, Observable } from 'rxjs';
import { InventoryDto } from '../../api/inventory/models';
import { StrictHttpResponse } from '../../api/strict-http-response';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  

  http=inject(HttpClient);
  inventoryConfig=inject(InventoryApiConfiguration)


  getStock(productId:string):Observable<InventoryDto> {
   return  getInventory(this.http,this.inventoryConfig.rootUrl,{productId}).pipe(
      map((response)=>response.body)
     )
  }

   
}
