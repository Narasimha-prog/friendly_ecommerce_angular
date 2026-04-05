import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminProductService } from '../../admin-product';
import { Toast } from '../../../shared/model/toast/toast';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-admin-category',
  imports: [CommonModule,RouterLink,FontAwesomeModule],
  templateUrl: './admin-category.html',
  styleUrl: './admin-category.scss',
})
export class AdminCategory {
//inject services + query client
  productAdminService=inject(AdminProductService);
  toastService = inject(Toast);
  queryClient=injectQueryClient();


//Queries
categoryQuery=injectQuery(()=>({
  queryKey: ['categories'],
  queryFn: () => lastValueFrom(this.productAdminService.findAllCategories()),
}));

  
deleteMutation=injectMutation(() => ({
  mutationFn: (categoryPublicId: string) => lastValueFrom(this.productAdminService.deleteCategory(categoryPublicId)),
  onSuccess: () => this.onDeleteSuccess(),
  onError: (error:unknown) => this.onDeleteError(error),
}));

editMutation=injectMutation(() => ({
  mutationFn: (categoryPublicId: string) => lastValueFrom(this.productAdminService.deleteCategory(categoryPublicId)),
  onSuccess: () => this.onDeleteSuccess(),
  onError: (error:unknown) => this.onDeleteError(error),

}));


constructor(){
  effect(()=>{
    this.handleCategoryQueryError();
  })
}
  private onDeleteSuccess(): void {
    this.queryClient.invalidateQueries({
      queryKey: ['categories'],})
    this.toastService.show('Category deleted ', 'SUCCESS');
  }


  private onDeleteError(error: unknown): void {
    console.error('Error deleting category:', error);
    this.toastService.show('Error deleting category', 'ERROR');
  
  }

  private handleCategoryQueryError(): void {
        if(this.categoryQuery.isError()){
          this.toastService.show('Error!  Failed to Load categories Please Try again', 'ERROR');
        }
  }
 deleteCategory(publicId: string) {
    this.deleteMutation.mutate(publicId);
  }
  editCategory(publicId: string) {
    this.deleteMutation.mutate(publicId);
  }

}
