import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReviewApiConfiguration } from '../../api/review/review-api-configuration';
import { ReviewRequestDto, ReviewResponseDto } from '../../api/review/models';
import { createReview, CreateReview$Params, deleteReview, DeleteReview$Params, getReviewsByProduct, GetReviewsByProduct$Params, updateReview, UpdateReview$Params } from '../../api/review/functions';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  

  private http=inject(HttpClient);

  private reviewConfig=inject(ReviewApiConfiguration);




  public createReview(data: ReviewRequestDto,files:Array<Blob> ):  Observable<ReviewResponseDto>{

const params: CreateReview$Params = {
      body: {
        review: data as any, // Cast to any to bypass generated type check
        files: files as Blob[],
      },
    };

     return createReview(this.http,this.reviewConfig.rootUrl,params).pipe(
      map(res => res.body as ReviewResponseDto)
     )
  }
public getReviewsByProduct(productId: string): Observable<ReviewResponseDto[]> {
    const params: GetReviewsByProduct$Params = { productId };

    return getReviewsByProduct(this.http, this.reviewConfig.rootUrl, params).pipe(
      map(res => res.body as Array<ReviewResponseDto>)
    );
  }

  public updateReview(id: string, data: ReviewRequestDto): Observable<ReviewResponseDto> {
    const params: UpdateReview$Params = {
      id: id,
      body: data
    };

    return updateReview(this.http, this.reviewConfig.rootUrl, params).pipe(
      map(res => res.body as ReviewResponseDto)
    );


  }

  public deleteReview(id: string): Observable<void> {
    const params: DeleteReview$Params = { id };

    return deleteReview(this.http, this.reviewConfig.rootUrl, params).pipe(
      map(res => res.body as void)
    );
  }
}
