import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../booking/shared/booking.service';
import { Booking } from '../../booking/shared/booking.model';
import { PaymentService } from '../../payment/shared/payment.service';
import moment = require('moment');

@Component({
  selector: 'bwm-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit {

  bookings:Booking[];
  payments:any[];

  constructor(private bookingService:BookingService,
              private paymentService:PaymentService) { }

  ngOnInit() {
    this.bookingService.manageBooking().subscribe(
      (booking:Booking[])=>{
      this.bookings=booking;
    },
    (err)=>{
      console.log(err);
    }
    );
    this.pendingPayment();
  }

  pendingPayment(){
    this.paymentService.getPendingPayments().subscribe(
      (payments:any)=>{
        this.payments=payments;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  acceptPayment(payment){
    this.paymentService.acceptPayments(payment).subscribe(
      (data)=>{
        payment.status='paid'
        console.log(payment.status);
      },
      (err)=>{

      }
    )
  }

  declinePayment(payment){
    this.paymentService.declinePayments(payment).subscribe(
      (data)=>{
        payment.status='declined';
        console.log(payment.status);
      },
      (err)=>{

      }
    )
  }

  isExpired(endAtString){
    const timeNow=moment();
    const endAt=moment(endAtString);
    return endAt.isBefore(timeNow);
  }

  reviewPublished(bookingIndex,review){
    debugger;
    this.bookings[bookingIndex]['review']=review;
  }
}
