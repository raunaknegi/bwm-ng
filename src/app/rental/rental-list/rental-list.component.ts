import { Component, OnInit } from '@angular/core';
import {RentalServices} from '../shared/rental.service'
import {Rental} from '../shared/rental.model';

@Component({
  selector: 'bwm-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit {
  rentals:Rental[]=[];

  constructor(private rentalService:RentalServices) { }

  ngOnInit() {
    const rentalObservable=this.rentalService.getRentals();

    rentalObservable.subscribe(
      (rentals:Rental[])=>{
        this.rentals=rentals;

      },
      (err)=>{

      },
      ()=>{
        
      }
    );
  }

}
