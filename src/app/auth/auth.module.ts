import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Routes,RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import{AuthComponent} from './auth.component'

import {AuthService} from './shared/auth.service';
import {AuthGuard} from './shared/auth.guard';
import {TokenInterceptor} from './shared/auth.interceptor'



const routes: Routes=[
    {path:'login',component:LoginComponent,canActivate:[AuthGuard]},
    {path:'register',component:RegisterComponent,canActivate:[AuthGuard]}
]


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthComponent  
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    AuthGuard,{
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    }
  ]
})
export class AuthModule { }
