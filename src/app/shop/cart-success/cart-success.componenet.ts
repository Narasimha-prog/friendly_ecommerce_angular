import { Component, inject } from '@angular/core';
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
})
export class CartSuccessComponent {
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private queryClient = injectQueryClient();
  
  // Get orderId from URL: /cart-success?orderId=123...
  orderId = injectQueryParams('orderId');

  /**
   * Fetch order details to verify status
   */
  orderQuery = injectQuery(() => ({
    queryKey: ['order-success', this.orderId()],
    queryFn: async () => {
      const id = this.orderId();
      if (!id) throw new Error('No Order ID found');
      
      const order = await lastValueFrom(this.orderService.getOrderById(id));
      
      // Cleanup logic: If order is found, clear the local cart
      this.cartService.clearCart(); 
      this.queryClient.invalidateQueries({ queryKey: ['cart'] });
      
      return order;
    },
    enabled: !!this.orderId(),
    retry: 3
  }));
}