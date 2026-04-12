import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartApiConfiguration } from '../../api/cart/cart-api-configuration';
import { getCart, addItem, removeItem, clearCart } from '../../api/cart/functions';
import { CartItemRequest, CartResponseDto } from '../../api/cart/models';
import { StrictHttpResponse } from '../../api/strict-http-response';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private cartConfig = inject(CartApiConfiguration);


  constructor() {
  
  }

  /**
   * Refreshes the local state from the backend
   */
  getCartDetails(): Observable<CartResponseDto> {
   return getCart(this.http, this.cartConfig.rootUrl)
      .pipe(
        map((res: StrictHttpResponse<CartResponseDto>) => res.body),

      )
  }

  /**
   * Adds an item to the backend cart
   */
  addToCart(productId: string, quantity: number = 1): Observable<CartResponseDto> {
    const body: CartItemRequest = { productId, quantity };
    
   return addItem(this.http, this.cartConfig.rootUrl, { body })
      .pipe(
        map((res: StrictHttpResponse<CartResponseDto>) => res.body)
      )
    
  }

  /**
   * Removes a specific product from the backend cart
   */
  removeFromCart(productId: string): Observable<CartResponseDto > {
  return  removeItem(this.http, this.cartConfig.rootUrl, { productId })
      .pipe(
        map((res: StrictHttpResponse<CartResponseDto>) => res.body),
    
      )
  }

  /**
   * Clears the entire cart on the backend
   */
  clearCart(): Observable<void> {
   return clearCart(this.http, this.cartConfig.rootUrl)
      .pipe(
        map((response:StrictHttpResponse<void>)=> response.body)
      )
  }

 
 
}