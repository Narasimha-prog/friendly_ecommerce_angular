import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProductService } from '../../admin-product';
import { Toast } from '../../../shared/model/toast/toast';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Pagination } from '../../../shared/model/request.model';
import { lastValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-admin-product',
  imports: [CommonModule,RouterModule,FontAwesomeModule],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.scss',
})
export class AdminProductComponent {
  productService = inject(AdminProductService);
 toastService = inject(Toast);
 queryClient=injectQueryClient();


 pageRequest:Pagination={
  page: 0,
  size: 10,
  sort: [],
 }

 productQuery=injectQuery(() => ({
  queryKey: ['products', this.pageRequest],
  queryFn: () => lastValueFrom( this.productService.findAllProducts(this.pageRequest))
 }));

constructor(){
  effect(()=>{
    this.handleProductQueryError();
  })
}

 private onDeletionSuccess(){
  this.queryClient.invalidateQueries({queryKey: ['products']});
  this.toastService.show('Product Deleted','SUCCESS');
 }

 deletionMutation=injectMutation(()=>({
  mutationFn: (productProductId: string) => lastValueFrom(this.productService.deleteProduct(productProductId)),
  onSuccess: () => this.onDeletionSuccess(),
  onError: (error: unknown) => this.onDeletionError(error),
 }));

 deleteProduct(productId: string) {
  this.deletionMutation.mutate(productId);
 }
 private onDeletionError(error: unknown){
  console.error('Error while deleting product:', error);
  this.toastService.show('issue while deleting product', 'ERROR');
 }  

 private handleProductQueryError(){
  if (this.productQuery.isError()) {
    this.toastService.show('Error while fetching products, Please try again', 'ERROR');
  }
 }
}
