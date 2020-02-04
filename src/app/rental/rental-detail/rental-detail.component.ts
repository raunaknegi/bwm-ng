import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Rental} from '../shared/rental.model';
import {RentalServices} from '../shared/rental.service';
import { ReviewService } from '../../review/shared/review.service';
import { Review } from '../../review/shared/review.model';
import * as moment from 'moment';

@Component({
  selector: 'bwm-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {

  rental:Rental;
  reviews:Review[]=[];
  rating:number;

  constructor(private route:ActivatedRoute,
              private rentalService:RentalServices,
              private reviewService:ReviewService)
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
          this.getRentalReviews(rental._id);
          this.getRentalRating(rental._id)
        }
      )

    }

    formatDate(date){
      return `${moment(date).fromNow()}`;
    }

    getRentalReviews(rentalId){
      this.reviewService.getReviews(rentalId).subscribe(
        (reviews)=>{
          this.reviews=reviews;
        }
      )
    }

    getRentalRating(rentalId){
      this.reviewService.getRating(rentalId).subscribe(
      (rating)=>{ 
        this.rating=rating;
      }
      )
    }
  
    
}
