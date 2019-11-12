import { Booking } from "../../booking/shared/booking.model";

export class Rental{
    _id:String;
    title:String;
    city:String;
    street:String;
    image:String;
    bedrooms:Number;
    description:String;
    dailyRate:Number;
    shared:Boolean;
    createdAt:String;
    bookings:Booking;
}