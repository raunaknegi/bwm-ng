import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class PaymentService {

  constructor(private http:HttpClient) { }

  public getPendingPayments(): Observable<any>{
    return this.http.get('api/payment');
  }

  public acceptPayments(payment):Observable<any>{
    return this.http.post('api/payment/accept',payment);
  }

  public declinePayments(payment):Observable<any>{
    return this.http.post('api/payment/decline',payment);
  }

} 
