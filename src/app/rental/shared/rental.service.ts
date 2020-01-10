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

  public manageRentals():Observable<any>{
    return this.http.get('/api/rentals/manage')
  }
  
  public deleteRentalById(rentalId:any): Observable<any>{
    return this.http.delete('/api/rentals/'+rentalId)
  }

  public patchRentals(rentalId:string, rentalData:any): Observable<any>{
    return this.http.patch('/api/rentals/'+rentalId,rentalData)
  }

  public verifyRentalUser(rentalId:string): Observable<any>{
    return this.http.get('/api/rentals/' + rentalId +'/verify-user');
  }
}