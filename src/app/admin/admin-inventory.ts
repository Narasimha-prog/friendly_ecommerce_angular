import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InventoryApiConfiguration } from '../api/inventory/inventory-api-configuration';

@Injectable({
  providedIn: 'root',
})
export class AdminInventory {
  

    http=inject(HttpClient);
    inventoryConfig=inject(InventoryApiConfiguration)


    
}
