import {Injectable} from '@angular/core';
import{Observable} from 'rxjs';
import {Rental} from './rental.model';

@Injectable()
export class RentalServices{
    private rentals:Rental[]=[{
        id:"1",
        title:"Central Apartment",
        city:"New york",
        street:"Times Sqaure",
        image:"http://via.placeholder.com/350x250",
        bedrooms:3,
        description:"very nice apartment",
        dailyRate:34,
        shared: false,
        createdAt:"24/12/2018"
      },
      {
        id: "2",
        title:"Central Apartment 2",
        city:"Manchester",
        street:"Sir matt busby way",
        image:"http://via.placeholder.com/350x250",
        bedrooms:4,
        description:"very nice Condo",
        dailyRate:60,
        shared: false,
        createdAt:"12/12/2016"
      },{
        id:"3",
        title:"Central Apartment 3",
        city:"San Francisco",
        street:"groove street",
        image:"http://via.placeholder.com/350x250",
        bedrooms:2,
        description:"nice apartment",
        dailyRate:20,
        shared: false,
        createdAt:"04/7/2015"
      },{
        id:"4",
        title:"Central Apartment 4",
        city:"Berlin",
        street:"Concentration street",
        image:"http://via.placeholder.com/350x250",
        bedrooms:3,
        description:"very nice apartment",
        dailyRate:34,
        shared: false,
        createdAt:"24/12/2018"
      }];

      public getRentalsById(rentalId:String):Observable<Rental>{
        return new Observable<Rental>((observer) => {
          setTimeout(()=> {
            const foundRental=this.rentals.find((rental)=> {
              return rental.id==rentalId;
            });
            observer.next(foundRental);
          },500);
        })
      }

      public getRentals():Observable<Rental[]> {

        const rentalObservable :Observable<Rental[]> = new Observable((observer) => {
          setTimeout(() => {
            observer.next(this.rentals);
          },500);
          setTimeout(() => {
            observer.error("err is executed");
          },2000);
          setTimeout(() => {
            observer.complete();
          },3000);
          
        });
          return rentalObservable;
      }
}