import { Component, OnInit } from '@angular/core';
import { Rental } from '../shared/rental.model';
import { RentalServices } from '../shared/rental.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'bwm-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.scss']
})
export class RentalCreateComponent implements OnInit {

  rental:Rental;
  rentalCategories=Rental.CATEGORIES;
  errors:any[]=[];

  constructor(private rentalService:RentalServices,
              private router:Router) { }

  handleImage(){
    this.rental.image="https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg";
  }

  ngOnInit() {
    this.rental=new Rental();
    this.rental.shared=false;
  }

  createRental(){
    this.rentalService.createNewRental(this.rental).subscribe(
      (rental:Rental)=>{
        this.router.navigate([`/rentals/${rental._id}`]);
      },
      (errorResponse:HttpErrorResponse)=>{
        this.errors=errorResponse.error.errors;
      })
  }
}
