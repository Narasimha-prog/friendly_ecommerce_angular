import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectParams } from 'ngxtension/inject-params'
import { UserProductService } from '../../user/servises/user-product';
import { Router } from '@angular/router';
import { Toast } from '../../shared/toast/toast';
import { Pagination } from '../../shared/model/request.model';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom} from 'rxjs';
import { FaIconComponent, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ProductCard } from "../../hero/product-card/product-card";
import { CartService } from '../cart/cart-service';
import { InventoryService } from '../../user/servises/inventory-service';
import { ReviewService } from '../../user/servises/review-service';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FaIconComponent, FontAwesomeModule, ProductCard],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {

  publicId=injectParams('publicId');
  productService=inject(UserProductService);
  router=inject(Router);
  toastService = inject(Toast);
  lastPublicId='';
  cartService=inject(CartService);
  inventoryService=inject(InventoryService)
  reviewService = inject(ReviewService);
  private queryClient = inject(QueryClient);


  pageRequest:Pagination={
    page:0,
    size:20,
    sort:[]
   }


   productQuery=injectQuery(()=>(
    {
      queryKey:['product',this.publicId()],
      queryFn:()=> firstValueFrom( this.productService.findOneProduct(this.publicId()!))
    }
   ));

   relatedProductsQuery=injectQuery(()=>(
    {
      queryKey:['relatedProduct',this.publicId()],
      queryFn:()=> firstValueFrom( this.productService.findProductsRelatedToCategory(this.pageRequest,this.publicId()!)),
      enabled: !!this.productQuery.data()
    }
   ));

   inventoryQuery=injectQuery(()=>({
       queryKey: ["inventory",this.publicId()],
       queryFn: ()=> firstValueFrom(this.inventoryService.getStock(this.publicId()!)),
       enabled: !!this.productQuery.data()
   }));

   reviewsQuery = injectQuery(() => ({
    queryKey: ['reviews', this.publicId()],
    queryFn: () => firstValueFrom(this.reviewService.getReviewsByProduct(this.publicId()!)),
    enabled: !!this.publicId(),
  }));
  get starDistribution() {
    const reviews = this.reviewsQuery.data() || [];
    if (reviews.length === 0) return [];
    
    const counts = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      const percentage = Math.round((count / reviews.length) * 100);
      return { star, percentage, count };
    });
    return counts;
  }

  get averageRating() {
    const reviews = this.reviewsQuery.data() || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating!, 0);
    return (sum / reviews.length).toFixed(1);
  }
constructor(){
 effect(() => {
      if (this.productQuery.isError()) {
        this.toastService.show('Could not load product details', 'ERROR');
      }
      if (this.relatedProductsQuery.isError()) {
        this.toastService.show('Could not load related products', 'ERROR');
      }
    });
}



// 1. The Mutation (Defined at class level)
  addToCartMutation = injectMutation(() => ({
    mutationFn: (productId: string) => firstValueFrom(this.cartService.addToCart(productId, 1)),
    onSuccess: () => {
      this.toastService.show('Item added to cart!', 'SUCCESS');
      // Sync the cart count globally
      this.queryClient.invalidateQueries({ queryKey: ['cart'] });
      
      // Reset button label after a delay
      setTimeout(() => {
        this.addToCartMutation.reset();
      }, 3000);
    },
    onError: () => {
      this.toastService.show('Failed to add item', 'ERROR');
    }
  }));

  // 2. The Method (Called by HTML)
  onAddToCart(productId: string) {
    this.addToCartMutation.mutate(productId);
  }

  // 3. Computed Helpers for the UI
  get buttonLabel() {
    if (this.addToCartMutation.isPending()) return 'Adding...';
    if (this.addToCartMutation.isSuccess()) return 'Added to cart';
    
    return 'Add to Cart';
  }

  get buttonIcon() {
    if (this.addToCartMutation.isSuccess()) return 'check';
    return 'shopping-cart';
  }
  }
  




