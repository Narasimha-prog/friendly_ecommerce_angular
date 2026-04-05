import { Component, effect, inject, Injector, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from './cart-service';
import { Toast } from '../../shared/model/toast/toast';
import { CartItem, CartItemAdd, StripeSession } from '../../shared/model/cart.model';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { RazorpayService } from '@eduvidu/angular-razorpay';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/authService';

@Component({
  selector: 'app-cart-component',
  imports: [CommonModule,RouterLink],
  providers: [RazorpayService],
  templateUrl: './cartComponent.html',
  styleUrl: './cartComponent.scss',
})
export class CartComponent implements OnInit{
  

  platformId=inject(PLATFORM_ID);

  cartService=inject(CartService);

  authService=inject(AuthService);

  toastService=inject(Toast);

 private injector = inject(Injector);
  
  cart: Array<CartItem>=[];

  labelcheckout="Login to checkout";

  action: 'Login'|'Checkout'='Login';

isInitPaymentIsLoading=false;



connectedUserQuery = this.authService.fetch();


  constructor(){
   this.extractListToUpdate();
   this.checkUserLoggedIn();
  }

  cartQuery=injectQuery(
    ()=>({
      queryKey:['cart'],
      queryFn:()=>lastValueFrom(this.cartService.getCartDetails())
    }

    )
  )

  initPaymentSession=injectMutation(()=>(
    {
      mutationFn:(cart:Array<CartItemAdd>)=> lastValueFrom(this.cartService.initPaymentSession(cart)),
      onSuccess:(result:StripeSession)=>this.razorpaySessionSuccess(result)
    }
  ))



private extractListToUpdate(){
  effect(()=>{
    //  console.log('isLoading:', this.cartQuery.isLoading());
    // console.log('isError:', this.cartQuery.isError());
    // console.log('isSuccess:', this.cartQuery.isSuccess());
    // console.log('data:', this.cartQuery.data());
    if(this.cartQuery.isSuccess()){
      this.cart=this.cartQuery.data().products;
      // this.cart.forEach(v=>console.log("From loop",v));
    }
  });
}
ngOnInit(): void {
  this.cartService.addedToCart.subscribe((cart) => {
    this.updateQuantity(cart);
    // console.log("From onInit ",cart);
  });
}


  private updateQuantity(cartUpdated:Array<CartItemAdd>){
        for(const cartItemToUpdate of this.cart){
          // console.log("From updateQuentity method",cartItemToUpdate)
        const itemToUpdate=  cartUpdated.find((item)=>item.publicId===cartItemToUpdate.publicId);
          if(itemToUpdate){
            cartItemToUpdate.quantity=itemToUpdate.quantity;
            // console.log(cartItemToUpdate)
          }else{
            this.cart.splice(this.cart.indexOf(cartItemToUpdate),1);
          }
        }
  }
  addQuentyToCart(publicId:string){
    this.cartService.addToCart(publicId,'add');
  }
    removeQuentyToCart(publicId:string,quantity:number){
      if(quantity>1){
         this.cartService.addToCart(publicId,'remove');
      }
   
  }

  removeItem(publicId:string){
   const itemToRemoveIndex= this.cart.findIndex(item=>item.publicId===publicId)
   if(itemToRemoveIndex){
        this.cart.splice(itemToRemoveIndex,1);
   }
   this.cartService.removeFromCart(publicId);
  }

  computeTotal(){
    return this.cart.reduce((acc,item)=>acc+item.price*item.quantity,0);
  }
  checkUserLoggedIn(){
  effect(()=>{

  if(this.connectedUserQuery?.isError()){
  this.labelcheckout='Login to checkout';
  this.action='Login';
   }else if(this.connectedUserQuery?.isSuccess()){
  this.labelcheckout='checkout';
     this.action='Checkout';
    }

  }
  )
  }

  


  checkIfEmpty():boolean{
    if(isPlatformBrowser(this.platformId)){
      return this.cartQuery.isSuccess()&& this.cart.length===0;
    }else{
      return false;
    }
  }


  checkout() {
     if(this.action==="Login"){
      this.authService.logIn();
     }else if(this.action==='Checkout'){
        this.isInitPaymentIsLoading=true;
       const cartItemsAdd= this.cart.map(item=>({publicId:item.publicId,quantity:item.quantity})as CartItemAdd)
       this.initPaymentSession.mutate(cartItemsAdd);
       
     }
}


     private razorpaySessionSuccess(session: StripeSession) {
      if (!isPlatformBrowser(this.platformId)) {
      return;
    }
const razorpayService = this.injector.get(RazorpayService);
    this.cartService.storeSessionId(session.id);

        const user = this.connectedUserQuery.data();  // data() is a function

  if (!user) {   
    this.toastService.show('User not loaded yet', 'ERROR');
    this.isInitPaymentIsLoading = false;
    return;
  }
  razorpayService
    .setKey(environment.razorpayKeyId)   // ✅ public key only
    .setAmount(this.computeTotal() * 100) // Razorpay expects paise; computeTotal() gives rupees
    .setCurrency('INR')
    .setOrderId(session.id)              // ✅ order id from backend
    .setPrefill({
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      email: user.email ?? '',      // ✅ safe access
      contact: '+917569208701',     // you can also pull from user if available
    })
    .onPaymentSuccess((res) => {
      this.isInitPaymentIsLoading = false;
      this.toastService.show(
        `Payment success: ${res.razorpay_payment_id}`,
        'SUCCESS'
      );
      this.cartService.goToSuccess(session.id);
    })
    .onPaymentError((err) => {
      this.isInitPaymentIsLoading = false;
      this.toastService.show(
        `Payment failed: ${err?.description}`,
        'ERROR'
      );
    })
    .openPaymentGateway();
}

}
