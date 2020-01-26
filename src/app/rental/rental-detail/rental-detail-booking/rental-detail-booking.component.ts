import { Component, OnInit, Input,ViewContainerRef,ViewChild, ViewEncapsulation } from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';
import { helperService } from '../../../common/service/helper.service';
import * as moment from 'moment';
import { Rental } from '../../shared/rental.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../../../booking/shared/booking.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { AuthService } from '../../../auth/shared/auth.service';



@Component({
  encapsulation:ViewEncapsulation.None,
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {

  @Input() rental:Rental;
  @ViewChild(DaterangePickerComponent)
    private picker:DaterangePickerComponent
  

  newBooking:Booking;
  modalRef:any
  errors:any[]=[]

  closeResult:string
  public daterange: any = {};
  public BookedOutDates:any[]=[];

  
  public options: any = {
    locale: { format: 'YYYY/MM/DD' },
    alwaysShowCalendars: false,
    opens:'left',
    autoUpdateInput:false,
    isInvalidDate:this.getInvalidDates.bind(this)
};


  constructor(private helper:helperService,
              private modalService: NgbModal,
              private bookingService:BookingService,
              private toastr:ToastsManager,
              private vcr: ViewContainerRef,
              public auth:AuthService) {
   this.toastr.setRootViewContainerRef(vcr);
   }

 

  ngOnInit() {

    this.newBooking=new Booking();
    this.getBookedOutDates()
  }

  private getInvalidDates(date){
    return this.BookedOutDates.includes(this.helper.bookingDateFormat(date))||date.diff(moment(),'days')<0
  }

  private resetDatePicker(){
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment())
    this.picker.datePicker.element.val('')
  }

  private getBookedOutDates(){
    const bookings: Booking[] =this.rental.bookings;
    if(bookings && bookings.length>0)
    {
      bookings.forEach((booking)=>{
        const dates=this.helper.getBookingRangeOfDates(booking.startAt,booking.endAt)
        this.BookedOutDates.push(...dates);
      })  
    }
  }

  reserveNow(content){
    this.errors=[]
    this.modalRef=this.modalService.open(content)
  }

  onPaymentConfirmed(paymentToken:any){
    this.newBooking.paymentToken=paymentToken;
    console.log(this.newBooking);
  }

  createBooking(){

    this.newBooking.rental=this.rental
    this.bookingService.confirmBooking(this.newBooking).subscribe(
      (bookingData)=>{
        
        this.BookedOutDates.push(...this.helper.getBookingRangeOfDates(bookingData.startAt,bookingData.endAt))
        this.newBooking=new Booking();
        this.modalRef.close();
        this.resetDatePicker();
        this.toastr.success('You are awesome!', 'Success!');
        
      },
      (errorResponse)=>{
        
        this.errors=errorResponse.error.errors;
      });
  }

  public selectedDate(value: any, datepicker?: any) {

        // any object can be passed to the selected event and it will be passed back here
        this.options.autoUpdateInput=true;
        this.newBooking.startAt= this.helper.bookingDateFormat(value.start);
        this.newBooking.endAt = this.helper.bookingDateFormat(value.end);
        this.newBooking.days=value.end.diff(value.start,'days');
        console.log(this.newBooking.days)
        this.newBooking.totalPrice=this.newBooking.days * this.rental.dailyRate;
  }
}
