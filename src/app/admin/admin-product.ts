import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseProduct, Product, ProductCategory } from './model/product.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { createPaginationOption, Page, Pagination } from '../shared/model/request.model';
import { create, create1, delete$, delete1, getAll, getAllProducts, update } from '../api/product/functions';
import { ProductApiConfiguration } from '../api/product/product-api-configuration';
import { CategoryRequestDto, CategoryResponseDto, CreateProductRequestDto, PageResponseProductResponseDto, ProductResponseDto, UpdateProductRequestDto } from '../api/product/models';
import { StrictHttpResponse } from '../api/strict-http-response';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  http = inject(HttpClient);

productConfig=inject(ProductApiConfiguration)
  createCategory(category:CategoryRequestDto): Observable<CategoryResponseDto> {
    return create1(this.http,this.productConfig.rootUrl,{body: category}).pipe(
      map((response: StrictHttpResponse<CategoryResponseDto>) => response.body)
    );
  }

  deleteCategory(id: string): Observable<void> {

    return delete1(this.http,this.productConfig.rootUrl,{id}).pipe(
      map((response: StrictHttpResponse<void>)=> response.body )
    )
  }

  findAllCategories(): Observable<Array<CategoryResponseDto>> {

    return getAll(this.http,this.productConfig.rootUrl).pipe(
      map((response:StrictHttpResponse<Array<CategoryResponseDto>>) => response.body)
    );
  }


  createProduct(product: CreateProductRequestDto,files:Array<Blob>):Observable<ProductResponseDto> {
    

    return create(this.http,this.productConfig.rootUrl,{body: {product,files}}).pipe(
    map((response:StrictHttpResponse<ProductResponseDto>)=> response.body)
   );



}

   deleteProduct(publicId:string):Observable<void>{
  const params=new HttpParams().set('publicId', publicId);

    return delete$(this.http,this.productConfig.rootUrl,{id:publicId}).pipe(
      map((response:StrictHttpResponse<void>)=> response.body)
    )
  }

  editProduct(id:string,body:UpdateProductRequestDto):Observable<ProductResponseDto>{

    return update(this.http,this.productConfig.rootUrl,{id,body}).pipe(
      map((response:StrictHttpResponse<ProductResponseDto>)=>response.body)
    )
  }


  findAllProducts(pageRequest:Pagination): Observable<PageResponseProductResponseDto>{


   return getAllProducts(this.http,this.productConfig.rootUrl,pageRequest).pipe(
    map((response:StrictHttpResponse<PageResponseProductResponseDto>)=> response.body)
   );

  }
}

