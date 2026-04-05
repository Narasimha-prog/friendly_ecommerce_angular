import { afterNextRender, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart-service';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-cart-success.componenet',
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './cart-success.componenet.html',
  styleUrl: './cart-success.componenet.scss',
})
export class CartSuccessComponent {
  
  orderId = injectQueryParams('orderId');
  cartService = inject(CartService);

  isValidAccess = true;

  constructor() {
    afterNextRender(() => this.verifySession());
  }

 verifySession() {
    const sessionIdLocalStorage = this.cartService.getSessionId();
    if (sessionIdLocalStorage !== this.orderId()) {
      this.isValidAccess = false;
    } else {
      this.cartService.deleteSessionId();
      this.cartService.clearCart();
    }
  }
}

