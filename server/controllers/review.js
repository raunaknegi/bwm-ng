const Booking=require('../models/booking');
const Rental=require('../models/rental');
const Review=require('../models/review');
const User=require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const moment=require('moment');

exports.getUserReview=function(req,res){
    const {rentalId}=req.query;

    Review.find({'rental':rentalId})
          .populate('user')
          .exec(function(err,reviews){
            if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            return res.json(reviews);
          })
}


exports.createReview=function(req,res){
    const reviewData=req.body;
    const {bookingId}=req.query;
    const user=res.locals.user;

    Booking.findById(bookingId)
           .populate({path:'rental',populate:{path:'user'}})
           .populate('review')
           .populate('user')
           .exec(async function(err,foundBooking){
            if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            const {rental}=foundBooking;
            if(rental.user.id===user.id){
                return res.status(422).send({ errors: [{ title: "Invalid Rental", detail: "the user cannot review his own Rental" }] });
            }

            const foundBookingUserId=foundBooking.user.id;
            if(foundBookingUserId !== user.id){
                return res.status(422).send({ errors: [{ title: "Invalid Booking", detail: "the user cannot review someone else's booking" }] });
            }

            const timeNow=moment();
            const endAt=moment(foundBooking.endAt);

            if(!endAt.isBefore(timeNow)){
                return res.status(422).send({ errors: [{ title: "Invalid date", detail: "the user cannot review before completing the trip" }] });
            }

            if(foundBooking.review){
                return res.status(422).send({ errors: [{ title: "Invalid review", detail: "the user cannot review more than once" }] });
            }

            const review=new Review({
                review:reviewData.text,
                rating:reviewData.rating
            });
            review.user=user;
            review.rental=rental;
            foundBooking.review=review

            try{
                await foundBooking.save();
                const savedReview=await review.save();

                return res.json(savedReview);
            } catch(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
    });
}

exports.getRating=function(req,res){
    const rentalId=req.params.id;
    Review.aggregate([
        {"$unwind":"$rental"},
        {"$group":{
            "_id":rentalId,
            "ratingAvg":{"$avg":"$rating"}
        }}],function(err,result){
            if(err){
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            
            return res.json(result[0]['ratingAvg']);
        })
}
