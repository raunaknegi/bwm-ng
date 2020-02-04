import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReviewService {

  constructor(private http:HttpClient) { }

  public createReview(review,bookingId):Observable<any>{
    return this.http.post('/api/review?bookingId='+bookingId,review)
  }

  public getReviews(rentalId):Observable<any>{
    return this.http.get('/api/review?rentalId='+rentalId)
  }

  public getRating(rentalId):Observable<any>{
    return this.http.get('/api/review/'+rentalId+"/rating");
  }

}
