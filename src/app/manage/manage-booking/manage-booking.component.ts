import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../booking/shared/booking.service';
import { Booking } from '../../booking/shared/booking.model';
import { PaymentService } from '../../payment/shared/payment.service';

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
    this.bookingService.manageBooking().subscribe((booking:Booking[])=>{
      this.bookings=booking;
    });
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

      },
      (err)=>{

      }
    )
  }

  declinePayment(payment){
    this.paymentService.declinePayments(payment).subscribe(
      (data)=>{

      },
      (err)=>{

      }
    )
  }
}
