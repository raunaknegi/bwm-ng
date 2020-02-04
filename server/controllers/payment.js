const Payment=require('../models/payment');
const Booking=require('../models/booking');
const Rental=require('../models/rental');
const User=require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const config=require('../config/dev')
const stripe = require('stripe')(config.STRIPE_SK);


exports.getPendingPayments=function(req,res){
    const user=res.locals.user;

    Payment
        .where({toUser:user})
        .populate({
            path:'booking',
            populate:{path:'rental'}
        })
        .populate('fromUser')
        .exec(function(err,foundPayments){
            if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            return res.json(foundPayments);
        })
}

exports.confirmPayment=function(req,res){
    const payment=req.body;
    const user=res.locals.user;

    Payment.findById(payment._id)
           .populate('toUser')
           .populate('booking')
           .exec(async function(err,foundPayment){
            if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            if(foundPayment.status==='pending' && user.id===foundPayment.toUser.id){
                debugger;
                const booking=foundPayment.booking;

                const charge=await stripe.charges.create({
                    amount:booking.totalPrice*100,
                    currency:'usd',
                    description: 'Software development services',
                    shipping: {
                        name: 'test',
                        address: {
                          line1: '510 Townsend St',
                          postal_code: '98140',
                          city: 'San Francisco',
                          state: 'CA',
                          country: 'US',
                        }
                      },
                      source: 'tok_visa',
                    
                })

                if(charge){
                    Booking.update({_id:booking.id},{status:'active'},function(){});

                    foundPayment.charge=charge;
                    foundPayment.status='paid';

                    foundPayment.save(function(err){
                        if(err){
                            return res.status(422).send({ errors: normalizeErrors(err.errors) });
                        }

                        User.update({_id:foundPayment.toUser},{$inc:{revenue:foundPayment.amount}},function(err,user){
                            if(err){
                                return res.status(422).send({ errors: normalizeErrors(err.errors) });
                            }

                            return res.json({status:'paid'})
                        })
                    })
                }
            }
           })
}


exports.declinePayment=function(req,res){
    const payment=req.body;
    const {booking}=payment;

    Booking.deleteOne({id:booking._id},function(err,deletedBooking){
        if(err){
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        Payment.update({_id:payment._id},{status:'declined'},function(){});
        Rental.update({_id:booking.rental._id},{$pull:{bookings:booking._id}},function(){});

        return res.json({status:'deleted'});
    });
}