import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminProductService } from '../../servises/admin-product';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '../../../shared/toast/toast';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { UserProductService } from '../../../user/servises/user-product';
import { CreateProductRequestDto, UpdateProductRequestDto } from '../../../api/product/models';

@Component({
  selector: 'app-update-product',
  imports: [ReactiveFormsModule],
  templateUrl: './update-product.html',
  styleUrl: './update-product.css',
})
export class UpdateProduct implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder).nonNullable;
  private userProductService = inject(UserProductService);
  private adminProductService=inject(AdminProductService)
  private router = inject(Router);
  private toastService = inject(Toast);

  productId = this.route.snapshot.paramMap.get('id')!;

  protected readonly sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  // 1. Fetch existing data
  productQuery = injectQuery(() => ({
    queryKey: ['product', this.productId],
    queryFn: () => lastValueFrom(this.userProductService.findOneProduct(this.productId)),
  }));

  // 2. Setup the mutation
  updateMutation = injectMutation(() => ({
    mutationFn: (data: UpdateProductRequestDto) => 
      lastValueFrom(this.adminProductService.editProduct(this.productId, data)),
    onSuccess: () => {
      this.toastService.show('Product updated successfully', 'SUCCESS');
      this.router.navigate(['/admin/products/list']);
    }
  }));

  categoriesQuery = injectQuery(() => ({
  queryKey: ['categories'],
  queryFn: () => lastValueFrom(this.adminProductService.findAllCategories()),
}));
  // 3. Define the Form (Same structure as Create)
  updateForm  = this.fb.group({
    sku: [{ value: '', disabled: true }],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(0.1)]],
    color: ['', [Validators.required]],
    size: ['XS', [Validators.required]],
    category: ['', [Validators.required]],
    brand: ['', [Validators.required]],
  
  });

  ngOnInit() {
  }

 onSubmit() {
  if (this.updateForm.valid) {
    const formValues = this.updateForm.getRawValue();
    
    // Create an object that matches the UpdateProductRequestDto interface
    const requestDto: UpdateProductRequestDto = {
      
      name: formValues.name,
      description: formValues.description,
      price: formValues.price,
      brand: formValues.brand,
      // Mapping form keys to DTO keys:
      productColor: formValues.color, 
      productSize: formValues.size,
      categoryId: formValues.category 
    };

    this.updateMutation.mutate(requestDto);
  }
}
constructor() {
    /**
     * This effect automatically runs whenever productQuery.data() updates.
     * When the API returns the old product data, this code fills the form.
     */
    effect(() => {
      const product = this.productQuery.data();
      if (product) {
        this.updateForm.patchValue({
          sku: product.sku,
          name: product.name,
          description: product.description,
          price: product.price,
          color: product.productColor, 
          size: product.productSize as any,
          category: product.categoryId,
          brand: product.brand,
        });
      }
    });
  }

onCancel(): void {
    this.router.navigate(['/admin/products/list']);
  }
}