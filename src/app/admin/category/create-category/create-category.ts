import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from '../../../shared/model/toast/toast';
import { Router } from '@angular/router';
import { CreateCategoryFormContent, ProductCategory } from '../../model/product.model';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { AdminProductService } from '../../admin-product';
import { NgxControlError } from 'ngxtension/control-error';

@Component({
  selector: 'app-create-category',
  imports: [CommonModule,FormsModule, ReactiveFormsModule,NgxControlError],
  templateUrl: './create-category.html',
  styleUrl: './create-category.scss',
})
export class CreateCategory {

  formBuilder = inject(FormBuilder);
  productService = inject(AdminProductService);
  toastService = inject(Toast);
  router = inject(Router)

  name=new FormControl<string>('',{nonNullable: true,validators:[Validators.required,Validators.minLength(3)]});

  public createCategoryForm = this.formBuilder.nonNullable.group<CreateCategoryFormContent>({
    name:this.name,
  })
  
  loading=false;

  createMutation=injectMutation(
    ()=>({
      mutationFn: (categoryToCreate:ProductCategory)=>lastValueFrom(this.productService.createCategory(categoryToCreate)),
      onSettled: () => this.onCreationSettled(),
      onSuccess: () => this.onCreationSuccess(),
      onError: (error) => this.onCreationError(error),
    })
  )

  create():void{
    
    const categoryToCreate: ProductCategory = {

      name: this.createCategoryForm.getRawValue().name
  }

  this.loading= true;
  this.createMutation.mutate(categoryToCreate);

  }
  private onCreationSettled():void {
    this.loading = false;
    
  }

  private onCreationSuccess():void {
    this.toastService.show('Category created ', 'SUCCESS');
    this.router.navigate(['/admin/categories/list']);
  }
  private onCreationError(error: unknown): void {
    console.error('Error creating category:', error);
    this.toastService.show('Issue when creating category: ' , 'ERROR');
  }
}
