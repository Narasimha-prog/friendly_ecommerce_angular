import { Component, computed, effect, inject, Injector, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from './cart-service';
import { Toast } from '../../shared/toast/toast';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { RazorpayService } from '@eduvidu/angular-razorpay';
import { AuthService } from '../../auth/authService';
import { PaymentService } from '../../user/servises/payment-servises';
import { OrderService } from '../../user/servises/order-service';
import { environment } from '../../../environments/environment.devlopment';

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

  private paymentService=inject(PaymentService)
  private router=inject(Router)
  private orderService=inject(OrderService)


  // 1. Fetch Cart Data
  cartQuery = injectQuery(() => ({
    queryKey: ['cart'],
    queryFn: () => lastValueFrom(this.cartService.getCartDetails()),
  }));

  // 2. Fetch User Data
  connectedUserQuery = this.authService.connectedUserQuery;

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


    incrementItemMutation = injectMutation(() => ({
    mutationFn: (productId: string) => lastValueFrom(this.cartService.increment(productId)),
    onSuccess: () => this.queryClient.invalidateQueries({ queryKey: ['cart'] })
  }));



    decrementItemMutation = injectMutation(() => ({
    mutationFn: (productId: string) => lastValueFrom(this.cartService.decrement(productId)),
    onSuccess: () => this.queryClient.invalidateQueries({ queryKey: ['cart'] })

  }));

  // 4. Computed labels using TanStack Signals
  actionLabel = computed(() => {
    if (this.connectedUserQuery.isError()) return 'Login to checkout';
    return 'Checkout';
  });

  // 5. Action Methods
  addQuantity(productId: string) {
    this.incrementItemMutation.mutate(productId);
  }

  removeQuantity(productId: string, currentQuantity: number) {
    
      // Logic for decrementing (usually another backend call or quantity: -1)
      this.decrementItemMutation.mutate(productId); 
    
  }

  deleteItem(productId: string) {
    this.removeItemMutation.mutate(productId);
  }

  computeTotal() {
    const products = this.cartQuery.data()?.items ?? [];
    return products.reduce((acc, item) => acc + (item.subTotal ?? 0), 0);
  }
checkoutMutation = injectMutation(() => ({
    mutationFn: async () => {
      const cartData = this.cartQuery.data();
      if (!cartData || cartData.items?.length === 0) throw new Error('Cart is empty');

      // 1. Map items to your backend OrderDto
      const orderDto = {
        items: cartData.items?.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      // 2. Create Order in Backend
      const order = await lastValueFrom(this.orderService.create(orderDto));

      // 3. Create Payment (Razorpay Order ID)
      const paymentInfo = await lastValueFrom(this.paymentService.initiatePayment(order.orderId!));

      return { order, paymentInfo };
    },
    onSuccess: (data) => {
      // 4. Open the Razorpay Modal
      this.launchRazorpay(data.order.orderId!, data.paymentInfo);
    },
    onError: (error) => {
      this.toastService.show('Failed to process checkout. Please try again.', 'ERROR');
    }
  }));

  /**
   * RAZORPAY MODAL LOGIC
   */
  private launchRazorpay(orderId: string, paymentInfo: any) {
    const options = {
      key: environment.razorpayKeyId, // Better to fetch from environment
      amount: paymentInfo.amount, // Already in paise from backend
      currency: paymentInfo.currency,
      name: 'E-Shop',
      description: `Payment for Order #${orderId.substring(0,8)}`,
      order_id: paymentInfo.razorpayOrderId,
      handler: (response: any) => {
        // This runs if payment is successful at Razorpay
        this.verifyAndRedirect(orderId, response);
      },
      prefill: {
        email: this.connectedUserQuery.data()?.email,
        name: this.connectedUserQuery.data()?.firstName
      },
      theme: { color: '#3399cc' },
      modal: {
        ondismiss: () => this.toastService.show('Payment cancelled', 'ERROR')
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  /**
   * VERIFY PAYMENT & REDIRECT
   */
  private verifyAndRedirect(orderId: string, razorpayResponse: any) {
    // Send the payment signatures to backend for verification
    this.paymentService.verify({
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpayOrderId: razorpayResponse.razorpay_order_id,
      razorpaySignature: razorpayResponse.razorpay_signature
    }).subscribe({
      next: () => {
        // Success! Redirect to our new success page
        this.router.navigate(['/cart-success'], { queryParams: { orderId } });
      },
      error: () => this.toastService.show('Payment verification failed!', 'ERROR')
    });
  }

  // Action method for the UI button
  onCheckout() {
    if (this.connectedUserQuery.isError()) {
      this.router.navigate(['/login']);
      return;
    }
    this.checkoutMutation.mutate();
  }



}

