import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { RouterLink } from '@angular/router';
import { UserProductService } from '../../user/servises/user-product';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom } from 'rxjs';
// import { CartService } from '../../shop/cart/cart-service';
import { AuthService } from '../../auth/authService';
import { CartService } from '../../shop/cart/cart-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FontAwesomeModule,RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{



  authService = inject(AuthService);
  
  productService=inject(UserProductService);

  cartService=inject(CartService);

  ngOnInit(): void {

  }
cartQuery = injectQuery(() => ({
    queryKey: ['cart'],
    queryFn: () => lastValueFrom(this.cartService.getCartDetails()),
    // staleTime: 1000 * 60 * 5, // Optional: Keep data fresh for 5 mins
  }));

  // Create a computed signal to calculate the total
  totalQuantity = computed(() => {
    const items = this.cartQuery.data()?.items ?? [];
    return items.reduce((acc, item) => acc + (item.quantity ?? 0), 0);
  });



  closeMenu(menu: HTMLDetailsElement) {
      menu.removeAttribute('open');
    
  }

  categoryQuery=injectQuery(()=>({
    queryKey:['categories'],
    queryFn:()=> firstValueFrom(this.productService.findAllCategories()),
  }))


  connectedUserQuery = this.authService.connectedUserQuery


  logIn():void { 
    console.log('Logging in...');  
  
    this.closeDropDownMenu();
    
  }

  logOut():void {
    this.closeDropDownMenu();
    this.authService.logOut();
  }

  isConnected(): boolean {
    return this.connectedUserQuery.status() ==='success' &&  this.connectedUserQuery.data()?.email !== this.authService.notConnected;
  }
isAdmin = computed(() => {
   const u = this.authService.connectedUserQuery.data();
   return u ? this.authService.hasAnyAuthorities(u, 'ADMIN') : false;
});
  closeDropDownMenu() {
    const bodyElement=document.activeElement as HTMLElement;

    if (bodyElement) {
      bodyElement.blur();
    }
  }

  
}
