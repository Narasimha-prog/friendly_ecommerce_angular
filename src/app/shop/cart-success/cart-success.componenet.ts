import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart/cart-service';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../../user/servises/order-service';

@Component({
  selector: 'app-cart-success',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './cart-success.componenet.html',
})export class CartSuccessComponent {
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private queryClient = injectQueryClient();
  
  orderId = injectQueryParams('orderId');

  orderQuery = injectQuery(() => ({
    queryKey: ['order-success', this.orderId()],
    queryFn: async () => {
      const id = this.orderId();
      if (!id) throw new Error('No Order ID found');
      return await lastValueFrom(this.orderService.getOrderById(id));
    },
    enabled: !!this.orderId(),
  }));

  constructor() {
    // This effect runs whenever the status of orderQuery changes
    effect(() => {
      if (this.orderQuery.isSuccess()) {
        console.log('Order verified, clearing cart...');
        
        // 1. Clear the backend/local state
        this.cartService.clearCart().subscribe({
          next: () => {
            // 2. Tell TanStack Query the cart data is now empty/stale
            this.queryClient.invalidateQueries({ queryKey: ['cart'] });
          }
        });
      }
    });
  }
}