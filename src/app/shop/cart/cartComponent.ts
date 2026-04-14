import { Component, computed, effect, inject, Injector, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from './cart-service';
import { Toast } from '../../shared/toast/toast';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { RazorpayService } from '@eduvidu/angular-razorpay';
import { AuthService } from '../../auth/authService';

@Component({
  selector: 'app-cart-component',
  imports: [CommonModule,RouterLink],
  providers: [RazorpayService],
  templateUrl: './cartComponent.html',
  styleUrl: './cartComponent.scss',
})
export class CartComponent {
  private cartService = inject(CartService);
  public authService = inject(AuthService);
  private toastService = inject(Toast);
  private queryClient = inject(QueryClient); // Used to invalidate cache

  // 1. Fetch Cart Data
  cartQuery = injectQuery(() => ({
    queryKey: ['cart'],
    queryFn: () => lastValueFrom(this.cartService.getCartDetails()),
  }));

  // 2. Fetch User Data
  connectedUserQuery = this.authService.fetch();

  // 3. Define Mutations for Actions
  // We use mutations because they "change" state on the server
  addItemMutation = injectMutation(() => ({
    mutationFn: (productId: string) => lastValueFrom(this.cartService.addToCart(productId, 1)),
    onSuccess: () => this.queryClient.invalidateQueries({ queryKey: ['cart'] })
  }));

  removeItemMutation = injectMutation(() => ({
    mutationFn: (productId: string) => lastValueFrom(this.cartService.removeFromCart(productId)),
    onSuccess: () => this.queryClient.invalidateQueries({ queryKey: ['cart'] })
  }));

  // 4. Computed labels using TanStack Signals
  actionLabel = computed(() => {
    if (this.connectedUserQuery.isError()) return 'Login to checkout';
    return 'Checkout';
  });

  // 5. Action Methods
  addQuantity(productId: string) {
    this.addItemMutation.mutate(productId);
  }

  removeQuantity(productId: string, currentQuantity: number) {
    if (currentQuantity > 1) {
      // Logic for decrementing (usually another backend call or quantity: -1)
      this.removeItemMutation.mutate(productId); 
    }
  }

  deleteItem(productId: string) {
    this.removeItemMutation.mutate(productId);
  }

  computeTotal() {
    const products = this.cartQuery.data()?.items ?? [];
    return products.reduce((acc, item) => acc + (item.subTotal ?? 0), 0);
  }


}