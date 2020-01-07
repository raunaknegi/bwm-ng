import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Booking } from './booking.model';


@Injectable()
export class BookingService{

    constructor(private http:HttpClient){

    }
    public confirmBooking(booking:Booking) :Observable<any>{
        return this.http.post('/api/booking',booking);  
    }
    public manageBooking():Observable<any>{
        return this.http.get('/api/booking/manage');
    }
}