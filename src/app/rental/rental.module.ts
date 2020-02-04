import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgPipesModule,UcWordsPipe} from 'ngx-pipes';
import {FormsModule} from '@angular/forms';
import {Routes,RouterModule} from '@angular/router';
import {MapModule} from '../common/map/map.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import {EditableModule} from '../common/components/editable/editable.module';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { PaymentModule } from '../payment/payment.module';
import { StarRatingModule } from 'angular-star-rating';


import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component'; 
import { RentalComponent } from './rental.component';
import { RentalDetailBookingComponent } from './rental-detail/rental-detail-booking/rental-detail-booking.component';
import { RentalSearchComponent } from './rental-search/rental-search.component';
import { RentalCreateComponent } from './rental-create/rental-create.component';
import {RentalDetailComponent} from './rental-detail/rental-detail.component';
import { RentalUpdateComponent } from './rental-update/rental-update.component';

import {RentalServices} from './shared/rental.service';
import { helperService } from '../common/service/helper.service';
import {BookingService} from '../booking/shared/booking.service';

import {AuthGuard} from '../auth/shared/auth.guard';
import {RentalGuard} from './shared/rental.guard';




                                      
const routes: Routes=[
    {path:'rentals',
    component:RentalComponent,
    children:
    [
        {path:'',component:RentalListComponent},
        {path:'new',component:RentalCreateComponent,canActivate:[AuthGuard]},
        {path:':rentalId',component:RentalDetailComponent},
        {path:':rentalId/edit',component:RentalUpdateComponent,canActivate:[AuthGuard,RentalGuard]},
        {path:':city/homes',component:RentalSearchComponent}
        
    ]}
]


@NgModule({
    declarations:[
        RentalListComponent,
        RentalListItemComponent,
        RentalComponent,
        RentalDetailComponent,
        RentalDetailBookingComponent,
        RentalSearchComponent,
        RentalCreateComponent,
        RentalUpdateComponent
    ],
        
    imports:[
       CommonModule,
       RouterModule.forChild(routes),
       HttpClientModule,
       NgPipesModule,
       MapModule,
       Daterangepicker,
       FormsModule,
       EditableModule,
       ImageUploadModule,
       PaymentModule,
       StarRatingModule.forChild()
    ],
    providers:[
        RentalServices,
        helperService,
        BookingService,
        UcWordsPipe,
        RentalGuard
    ]
})

export class RentalModule{}