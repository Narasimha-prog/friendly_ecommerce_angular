import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createPaginationOption, Page, Pagination } from '../model/request.model';
import { ProductFilter } from '../../admin/model/product.model';
import { Product, ProductCategory } from '../../admin/model/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserProductService {


  findAllCategories(): Observable<Page<ProductCategory>> {
  
    return this.http.get<Page<ProductCategory>>(`${environment.apiUrl}/categories`);
  }

  http=inject(HttpClient);

  public findAllFeaturedProducts(pageRequest:Pagination):Observable<Page<Product>>{
    const params=createPaginationOption(pageRequest);
    return this.http.get<Page<Product>>(`${environment.apiUrl}/products-shop/featured`,{params});

  }

  public findOneProduct(publicId:string):Observable<Product>{
    const params=new HttpParams().set('publicId',publicId);
    return this.http.get<Product>(`${environment.apiUrl}/products-shop/find-one`,{params});
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
