import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { RentalServices } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';

@Component({
  selector: 'bwm-rental-search',
  templateUrl: './rental-search.component.html',
  styleUrls: ['./rental-search.component.scss']
})
export class RentalSearchComponent implements OnInit {

  city:String;
  rentals:Rental[]=[];
  errors:any[]=[];

  constructor(private route:ActivatedRoute,
              private rentalService:RentalServices) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params)=>{
        this.city=params['city'];
        this.GetRentals();
      }
    )
  }

  GetRentals(){
    this.errors=[];
    this.rentals=[];

    this.rentalService.getRentalsByCity(this.city).subscribe(
      (rentals:Rental[])=>{
        debugger;
        this.rentals=rentals;
      },
      (errorResponse)=>{
        this.errors=errorResponse.error.errors;
        console.log(errorResponse);
      })
  }

}
