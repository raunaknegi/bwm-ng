import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private url:string;

  private handleAuth():boolean{
    if(this.loginOrRegister()){
        this.router.navigate(['/rentals']);
        return false;
    }else{
        return true;
    }
  };

  private notHandleAuth():boolean{
    if(this.loginOrRegister()){
        return true;
    }else{
        this.router.navigate(['login']);
        return false;
    }
  };

  private loginOrRegister():boolean{
      if((this.url.includes('/login'))||(this.url.includes('/register'))){
        return true; 
      }else{
          return false;
      }             
  }


  canActivate(router:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean{
    this.url = state.url;

   if( this.authService.isAuthenticated()){
       return this.handleAuth();
   }
   else{
       return this.notHandleAuth();
   }


  }
}