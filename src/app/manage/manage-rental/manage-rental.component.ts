import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Rental } from '../../rental/shared/rental.model';
import { RentalServices } from '../../rental/shared/rental.service';
import { ToastsManager } from 'ng2-toastr';


@Component({
  selector: 'bwm-manage-rental',
  templateUrl: './manage-rental.component.html',
  styleUrls: ['./manage-rental.component.scss']
})
export class ManageRentalComponent implements OnInit {

  rentals:Rental[];
  deleteRentalIndex:number;

  constructor(public rentalService:RentalServices,
              private toastr:ToastsManager,
              private vcr:ViewContainerRef) {
  this.toastr.setRootViewContainerRef(vcr);            
  }

  ngOnInit() {
    this.rentalService.manageRentals().subscribe((rentals:Rental[])=>{
      this.rentals=rentals;
    });
  }

  deleteRental(rentalId:any){
    this.rentalService.deleteRentalById(rentalId).subscribe(()=>{
      this.toastr.success('Rental deleted!','Success');
      this.rentals.splice(this.deleteRentalIndex,1);
      this.deleteRentalIndex=undefined;
    },
    (errorResponse)=>{
      this.toastr.error(errorResponse.error.errors[0].detail,'Failed');
    })
  }

}
