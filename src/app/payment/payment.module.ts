import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentService } from './shared/payment.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PaymentComponent
  ],
  exports:[
    PaymentComponent
  ],
  providers:[
    PaymentService
  ]
})
export class PaymentModule { }
