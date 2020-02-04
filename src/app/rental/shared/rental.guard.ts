import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Observable} from 'rxjs';
import { RentalServices } from './rental.service';
 
@Injectable()
export class RentalGuard implements CanActivate {
  constructor(private rentalService: RentalServices,
              private router: Router) {}

  canActivate(router:ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<boolean>{
        const rentalId=router.params.rentalId;
        return this.rentalService.verifyRentalUser(rentalId).pipe(map(()=>{
            return true;
        }),catchError(()=>{
            this.router.navigate(['/rentals']);
            return Observable.of(false);
        }),)
    }
}