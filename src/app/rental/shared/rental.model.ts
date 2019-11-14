import { Booking } from "../../booking/shared/booking.model";

export class Rental{

    static readonly CATEGORIES=['House','Apartment','Condo'];

    _id:String;
    title:String;
    city:String;
    street:String;
    category:String;
    image:String;
    bedrooms:Number;
    description:String;
    dailyRate:number;
    shared:Boolean;
    createdAt:String;
    bookings:Booking[];
}