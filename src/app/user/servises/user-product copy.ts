import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createPaginationOption, Page, Pagination } from '../../shared/model/request.model';
import { ProductFilter } from '../../admin/model/product.model';
import { Product, ProductCategory } from '../../admin/model/product.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { filter, getAll, getById, getFeaturedProducts, relatedProducts } from '../../api/product/functions';
import { ProductApiConfiguration } from '../../api/product/product-api-configuration';
import { CategoryResponseDto, PageResponseProductResponseDto, ProductResponseDto } from '../../api/product/models';
import { StrictHttpResponse } from '../../api/strict-http-response';


@Injectable({
  providedIn: 'root'
})
export class UserProductService {

private http = inject(HttpClient);
private productConfig=inject(ProductApiConfiguration);


  findAllCategories(): Observable<Array<CategoryResponseDto>> {
  return getAll(this.http, this.productConfig.rootUrl).pipe(
    // Extract only the array from the full HTTP response object
    map((response: StrictHttpResponse<Array<CategoryResponseDto>>) => {
      return response.body;
    })
  );
}


  public findAllFeaturedProducts(pageRequest:Pagination):Observable<PageResponseProductResponseDto>{
   
    return getFeaturedProducts(this.http,this.productConfig.rootUrl,pageRequest).pipe(
      map((response:StrictHttpResponse<PageResponseProductResponseDto>) => response.body)
    )

  }

  public findOneProduct(publicId:string):Observable<ProductResponseDto>{
    return getById(this.http,this.productConfig.rootUrl,{id:publicId}).pipe(
map((response:StrictHttpResponse<ProductResponseDto>) => (response.body))
    )
  }

  public findProductsRelatedToCategory(pageRequest:Pagination,publicId:string):Observable<PageResponseProductResponseDto>{
    
    return relatedProducts(this.http,this.productConfig.rootUrl,{... pageRequest,publicId}).pipe(
      map((response:StrictHttpResponse<PageResponseProductResponseDto>) => response.body)
    )


  }

public filter(pageRequest:Pagination,productFilter:ProductFilter):Observable<PageResponseProductResponseDto>{
  let categoryId: string='';
  let productSizes: string[] | undefined;

  if (productFilter.category) {
    categoryId = productFilter.category;
  }

  if (productFilter.size) {
  
    productSizes = [productFilter.size];
  }


  return filter(this.http,this.productConfig.rootUrl,{...pageRequest,categoryId,productSizes}).pipe(
      map((response:StrictHttpResponse<PageResponseProductResponseDto>) => response.body)
    );
}
}
