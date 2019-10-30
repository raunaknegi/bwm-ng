const Booking=require('../models/booking');
const Rental=require('../models/rental');
const User=require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const moment=require('moment');

exports.createBooking=function(req,res){

    const {startAt,endAt,totalPrice,days,guests,rental}=req.body;
    const foundUser=res.locals.foundUser;   //from authMiddleware, stored as foundUser


    const booking=new Booking({startAt,endAt,totalPrice,days,guests});


    Rental.findById(rental._id)
          .populate('bookings')
          .populate('user')
          .exec(function(err,foundRental){
              if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
              }
              if(foundRental.user.id===foundUser.id){
                return res.status(422).send({ errors: [{ title: "Invalid data", detail: "the user cannot book his own Rental" }] });
              }
              if(isValidBooking(booking,foundRental)){

                booking.user=foundUser;
                booking.rental=foundRental;
                foundRental.bookings.push(booking);

                booking.save(function(err){
                    if(err){
                        return res.status(422).send({ errors: normalizeErrors(err.errors) });  
                    }

                    foundRental.save();
                    User.update({_id:foundUser.id},{$push:{bookings:booking}},function(){});
                    return  res.json({startAt:booking.startAt,endAt:booking.endAt})
                });                 
                  
              }else{
                return res.status(422).send({ errors: [{ title: "Invalid dates", detail: "the dates are already taken" }] });   
              }
          });    
}

function isValidBooking(proposedBooking,rental){
    let isValid=true;
    if(rental.bookings&&rental.bookings.length>0){
        isValid =rental.bookings.every(function(booking){
            const proposedStart=moment(proposedBooking.startAt);
            const proposedEnd=moment(proposedBooking.endAt);

            const actualStart=moment(booking.startAt);
            const actualEnd=moment(booking.endAt);

           if((actualStart<proposedStart && actualEnd<proposedStart)||(actualStart>proposedEnd && actualEnd>proposedEnd)){
               return true
           }else{
               return false;
           }

        });
    }    
    return isValid;    
}