import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Rental} from '../shared/rental.model';
import {RentalServices} from '../shared/rental.service';

@Component({
  selector: 'bwm-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {

  rental:Rental

  constructor(private route:ActivatedRoute,
              private rentalService:RentalServices)
              { }

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
  
    
}
