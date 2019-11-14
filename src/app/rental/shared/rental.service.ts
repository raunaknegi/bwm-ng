import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from './rental.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RentalServices {

  constructor(private http: HttpClient) {}

  public getRentalsById(rentalId: String): Observable<any> {
    return this.http.get('/api/rentals/' + rentalId)
  }

  public getRentals(): Observable<any> {
    return this.http.get('/api/rentals');
  }

  public getRentalsByCity(rentalCity:String):Observable<any>{
    return this.http.get(`/api/rentals/?city=${rentalCity}`);
  }

  public createNewRental(newRental:Rental):Observable<any>{
    return this.http.post('api/rentals',newRental);
  }
}