import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



import { AppComponent } from './app.component';
import {HeaderComponent} from './common/header/header.component';

import { RentalModule} from './rental/rental.module';
import {AuthModule} from './auth/auth.module';
import { ManageModule } from './manage/manage.module';
import {UserModule} from './user/user.module';

import {AuthService} from './auth/shared/auth.service';




const routes: Routes=[
  {path:'', redirectTo:'/rentals',pathMatch:'full'},
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    RentalModule,
    HttpClientModule,
    AuthModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    ManageModule,
    UserModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
