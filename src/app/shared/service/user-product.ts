import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createPaginationOption, Page, Pagination } from '../model/request.model';
import { ProductFilter } from '../../admin/model/product.model';
import { Product, ProductCategory } from '../../admin/model/product.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getAll, getById } from '../../api/product/functions';
import { ProductApiConfiguration } from '../../api/product/product-api-configuration';
import { CategoryResponseDto, ProductResponseDto } from '../../api/product/models';
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


  public findAllFeaturedProducts(pageRequest:Pagination):Observable<Page<Product>>{
    const params=createPaginationOption(pageRequest);
    return this.http.get<Page<Product>>(`${environment.apiUrl}/products-shop/featured`,{params});

  }

  public findOneProduct(publicId:string):Observable<ProductResponseDto>{
    return getById(this.http,this.productConfig.rootUrl,{id:publicId}).pipe(
map((response:StrictHttpResponse<ProductResponseDto>) => (response.body))
    )
  }

  public findProductsRelatedToCategory(pageRequest:Pagination,publicId:string):Observable<Page<Product>>{
    const params=createPaginationOption(pageRequest).append('publicId',publicId);
    return this.http.get<Page<Product>>(`${environment.apiUrl}/products-shop/related`,{params});

  }

public filter(pageRequest:Pagination,productFilter:ProductFilter):Observable<Page<Product>>{
  let params = createPaginationOption(pageRequest);
  if (productFilter.category) {
    params = params.append('categoryId', productFilter.category); // re-assigned
  }
  if (productFilter.size) {
    params = params.append('productSizes', productFilter.size);   // re-assigned
  }

  return this.http.get<Page<Product>>(`${environment.apiUrl}/products-shop/filter`,{params});

}
}
