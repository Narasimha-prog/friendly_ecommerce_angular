import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AdminProductService } from '../../admin-product';
import { Toast } from '../../../shared/model/toast/toast';
import { Router } from '@angular/router';
import { BaseProduct, CreateProductFormContent, ProductCategory, ProductPicture, ProductSizes ,sizes} from '../../model/product.model';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { NgxControlError } from 'ngxtension/control-error';

// --- Custom Validator for minimum array length ---
function minArrayLength(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as any[];
    if (!value || value.length < min) {
      return { minArrayLength: { requiredLength: min, actualLength: value?.length || 0 } };
    }
    return null;
  };
}
@Component({
  selector: 'app-create-product',
  imports: [CommonModule,ReactiveFormsModule,NgxControlError],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProductComponent {
  
  formBuilder=inject(FormBuilder);
  productService=inject(AdminProductService);
  toastService=inject(Toast);
  router=inject(Router);

  categoriesQuery=injectQuery(()=>({
    queryKey: ['categories'],
  queryFn: () => lastValueFrom(this.productService.findAllCategories()),
  
  }));

  createMutation=injectMutation(()=>({
    mutationFn: (product: BaseProduct) => lastValueFrom(this.productService.createProduct(product)),
    onSettled: () => this.onCreationSettled(),
    onSuccess: () => this.onCreationSuccess(),
    onError: (error: unknown) => this.onCreationError(error)
  }))


  public productPictures=new Array<ProductPicture>();

name=new FormControl<string>('',{nonNullable: true,validators:[Validators.required,Validators.minLength(3)]});

description=new FormControl<string>('',{nonNullable: true,validators:[Validators.required, Validators.minLength(10)]});

price=new FormControl<number>(0,{nonNullable: true,validators:[Validators.required, Validators.min(0.1)]});

size=new FormControl<ProductSizes>('XS',{nonNullable: true,validators:[Validators.required]});


color=new FormControl<string>('',{nonNullable: true,validators:[Validators.required]});


featured=new FormControl<boolean>(false,{nonNullable: true,validators:[Validators.required]});

pictures=new FormControl<ProductPicture[]>([],{nonNullable: true,validators:[Validators.required, minArrayLength(1)]});

stock=new FormControl<number>(0,{nonNullable: true,validators:[Validators.required]});

category=new FormControl<string>('',{nonNullable: true,validators:[Validators.required]});
brand=new FormControl<string>('',{nonNullable: true,validators:[Validators.required, Validators.minLength(3)]});

  public createForm=this.formBuilder.nonNullable.group<CreateProductFormContent>({
     brand: this.brand,
    color: this.color,
    name: this.name,
    description: this.description,
    price: this.price,
    size: this.size,
    featured: this.featured,
    stock: this.stock,
    category: this.category,
    pictures: this.pictures
  });

  leading=false;

  private onCreationSettled() {
    this.leading= false;

  }

  private onCreationSuccess() {
    this.router.navigate(['/admin/products/list'])

      this.toastService.show('Product created','SUCCESS');
  }

  private onCreationError(error: unknown) {
    console.error('Error creating product:', error);
    this.toastService.show('Issue while creating product: ' , 'ERROR');
  }



  create(): void{

    const productToCreate:BaseProduct={
    brand: this.createForm.getRawValue().brand,
    color: this.createForm.getRawValue().color,
    name: this.createForm.getRawValue().name,
    description: this.createForm.getRawValue().description,
    price: this.createForm.getRawValue().price,
    size: this.createForm.getRawValue().size,
    featured: this.createForm.getRawValue().featured,
    nbInStock: this.createForm.getRawValue().stock,
    category: {
      publicId: this.createForm.getRawValue().category.split('+')[0],
      name: this.createForm.getRawValue().category.split('+')[1]
    },
    pictures: this.productPictures    
    
  };

  this.leading=true;
  this.createMutation.mutate(productToCreate);
}

private extractFileFromTarget(target: EventTarget | null): FileList | null {
  const htmlInputElement = target as HTMLInputElement;

  if(target===null || htmlInputElement.files===null) {
    return null;
  }

  return htmlInputElement.files;
}

  onUploadNewPicture(target: EventTarget | null) {
    const pictureFiles = this.extractFileFromTarget(target);
    const MAX_SIZE_MB = 1;

    if (!pictureFiles) return;

    const validPictures: ProductPicture[] = [];

    for (let i = 0; i < pictureFiles.length; i++) {
      const picture = pictureFiles.item(i);
      if (!picture) continue;

      const sizeMB = picture.size / (1024 * 1024);
      if (sizeMB > MAX_SIZE_MB) {
        this.toastService.show(`"${picture.name}" is too large. Max ${MAX_SIZE_MB}MB allowed.`, 'ERROR');
        continue;
      }

      validPictures.push({
        file: picture,
        mineType: picture.type || 'application/octet-stream'
      });
    }

    // Update component and FormControl
    this.productPictures = validPictures;
    this.pictures.setValue(this.productPictures);
    this.pictures.updateValueAndValidity();
  }
protected readonly sizes = sizes;
}
