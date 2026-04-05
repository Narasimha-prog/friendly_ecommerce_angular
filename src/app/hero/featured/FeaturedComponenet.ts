import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProductService } from '../../shared/service/user-product';
import { Pagination } from '../../shared/model/request.model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ProductCard } from '../product-card';

@Component({
  selector: 'app-featured-component',
  imports: [CommonModule,ProductCard],
  templateUrl: './FeaturedComponenet.html',
  standalone: true,
  styleUrl: './FeaturedComponenet.scss',
})
export class FeaturedComponent {

  userProductService=inject(UserProductService);

  pageRequest:Pagination={
    page:0,
    size:4,
   sort:[]
  }

  featuredProductQuery=injectQuery(()=>(
    {
      queryKey:['featured-products',this.pageRequest],
      queryFn:()=> firstValueFrom(this.userProductService.findAllFeaturedProducts(this.pageRequest))
    }
  ));



}
