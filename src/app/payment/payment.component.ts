import { Component, OnInit,ViewChild, Output,EventEmitter } from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'bwm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  stripe:any;
  elements:any;

  @ViewChild('cardNumber') cardNumRef:any;
  @ViewChild('cardExpiry') cardExpRef:any;
  @ViewChild('cardCVV') cardCVVRef:any;

  cardNumber:any;
  cardExpiry:any;
  cardCvv:any;

  @Output() paymentConfirmed:any =new EventEmitter;

  error:string="";
  token:any;
  isValidatingCard:boolean=false;

  constructor() {
    this.stripe = Stripe(environment.STRIPE_PK);
    this.elements = this.stripe.elements();
    this.onChange=this.onChange.bind(this);
   }

  ngOnInit() {
    this.cardNumber=this.elements.create('cardNumber',{style:styles});
    this.cardNumber.mount(this.cardNumRef.nativeElement);

    this.cardExpiry=this.elements.create('cardExpiry',{style:styles});
    this.cardExpiry.mount(this.cardExpRef.nativeElement);

    this.cardCvv=this.elements.create('cardCvc',{style:styles});
    this.cardCvv.mount(this.cardCVVRef.nativeElement);

    this.cardNumber.addEventListener('change',this.onChange);
    this.cardExpiry.addEventListener('change',this.onChange);
    this.cardCvv.addEventListener('change',this.onChange);
  }

  ngOnDestroy(){
    this.cardNumber.removeEventListener('change',this.onChange);
    this.cardExpiry.removeEventListener('change',this.onChange);
    this.cardCvv.removeEventListener('change',this.onChange);
  }

  onChange(event){
    const error=event.error;
    if(error){
      this.error=error.message;
    }else{
      this.error="";
    }
  }

  isCardValid():boolean{
    return this.cardNumber._complete && this.cardExpiry._complete && this.cardCvv._complete;
  }

  async onSubmit(){
    this.isValidatingCard=true;
    const res=await this.stripe.createToken(this.cardNumber);
    this.isValidatingCard=false;
    if(res.error){
      console.log(res.error);
    }else{
      this.token=res.token;
      this.paymentConfirmed.emit(res.token);
    }
  }
}


const styles = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    lineHeight: '40px',
    fontWeight: 300,
    fontFamily: 'Helvetica Neue',
    fontSize: '15px',

    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};
