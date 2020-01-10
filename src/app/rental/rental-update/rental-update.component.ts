import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Rental} from '../shared/rental.model';
import {RentalServices} from '../shared/rental.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr';
import {UcWordsPipe} from 'ngx-pipes';

@Component({
  selector: 'bwm-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})
export class RentalUpdateComponent implements OnInit {

  rental:Rental;
  updatedLocation:Subject<any>=new Subject();

  constructor(private route:ActivatedRoute,
              private rentalService:RentalServices,
              private toastr:ToastsManager,
              private vcr:ViewContainerRef,
              private ucPipe:UcWordsPipe)
              { 
    this.toastr.setRootViewContainerRef(vcr);
    this.transformLocation=this.transformLocation.bind(this);
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.getRental(params['rentalId']);
      }
    )}


    getRental(rentalId:String){
      this.rentalService.getRentalsById(rentalId).subscribe(
        (rental:Rental)=> {
          this.rental=rental;
        }
      )

    }

    updateRental(rentalId:string, rentalData:any){
      this.rentalService.patchRentals(rentalId,rentalData).subscribe(
        (updatedRental:Rental)=>{
          this.rental=updatedRental;

          if(rentalData.city || rentalData.street){
            this.updatedLocation.next(this.rental.city + ', ' + this.rental.street);
          }
        },
        (err:HttpErrorResponse)=>{
          this.toastr.error(err.error.errors[1].detail,'Error');
          this.getRental(rentalId);
        }
      )
    }
  
  countBed(beds:number){
    return parseInt(<any>beds||0,10);
  }

  transformLocation(value:string){
   return this.ucPipe.transform(value)
  }

}
