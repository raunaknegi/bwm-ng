const Booking=require('../models/booking');
const Rental=require('../models/rental');
const Payment=require('../models/payment');
const User=require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const moment=require('moment');
const config=require('../config/dev')
const stripe = require('stripe')(config.STRIPE_SK);

exports.createBooking=function(req,res){

    const {startAt,endAt,totalPrice,days,guests,rental,paymentToken}=req.body;
    const foundUser=res.locals.foundUser;   //from authMiddleware, stored as foundUser

    const booking=new Booking({startAt,endAt,totalPrice,days,guests});


    Rental.findById(rental._id)
          .populate('bookings')
          .populate('user')
          .exec(async function(err,foundRental){

              
              if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
              }
              if(foundRental.user.id===foundUser.id){
                return res.status(422).send({ errors: [{ title: "Invalid data", detail: "the user cannot book his own Rental" }] });
              }
              if(isValidBooking(booking,foundRental)){
                debugger;
                booking.user=foundUser;
                booking.rental=foundRental;
                foundRental.bookings.push(booking);
                const {payment,err}=await createPayment(booking,foundRental.user,paymentToken);
                if(payment){
                 
                  booking.payment=payment;
                  booking.save(function(err){
                      if(err){
                          return res.status(422).send({ errors: normalizeErrors(err.errors) });  
                      }
  
                      foundRental.save();
                      User.update({_id:foundUser.id},{$push:{bookings:booking}},function(){});
                      return  res.json({startAt:booking.startAt,endAt:booking.endAt,user:foundUser.id,
                       owner: foundRental.user.id})
                  });
                }else if(err){
                  return res.status(422).send({ errors: [{ title: "Payment error", detail: err.message }] });
                }                   
                  
              }else{
                return res.status(422).send({ errors: [{ title: "Invalid dates", detail: "the dates are already taken" }] });   
              }
          });    
}

exports.manageBooking=function(req,res){
  foundUser=res.locals.foundUser;
    Booking.where({user:foundUser})
          .populate('rental')
          .exec(function(err,foundBooking){
            if(err){

                res.status(422).send({errors:[{title:"Rental error",detail:"this page doesn't exist"}]});

            }
            res.json(foundBooking);  
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

async function createPayment(booking,toUser,token){
  debugger;
  const {user}=booking;
  const customer=await stripe.customers.create({
    name:'test',
    source:token.id,
    email:user.email,
    description:'test description',
    address:{
      city : "Toronto",
      country: "Canada",
      line1: 42,
      line2: "",
      postal_code: "M4B 1B5",
      state: "Ontario"
    }
  });
  

  if(customer){
    User.update({_id:user.id},{ $set:{stripeCustomerId:customer.id}},()=>{});

    const payment=new Payment({
      fromUser:user,
      toUser:toUser,
      fromStripeCustomerId:customer.id,
      booking:booking,
      tokenId:token.id,
      amount:booking.totalPrice*100*0.9
    });

    try{
      const savedPayment=await payment.save();
      return {payment:savedPayment}
    }catch(err){
      return {err:err.message}
    }

  }else{
    return {err:'Cannot process payment!'}
  }
}