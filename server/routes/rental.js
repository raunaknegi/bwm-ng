const express=require('express');
const Rental=require('../models/rental');
const User=require('../models/user');
const userControl=require('../controllers/routing');
const {normalizeErrors} =require('../helpers/mongoose')

const router=express.Router();

router.get('/secrets',userControl.authMiddleware,function(req,res){
    res.json({"secret":true})
})



router.get('',function(req,res){

    const city=req.query.city;
    const check=city ? {city: city.toLowerCase()} : {};
    
        Rental.find(check)
              .select('-bookings')
              .exec(function(err,foundRental){
                  if(err){
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                  }
                  if(city && foundRental.length===0){
                    return res.status(422).send({errors:[{title:"Could not find city",detail:`the city ${city} was not found`}]});
                  }
                  return res.json(foundRental)
              });

    
});

router.get('/:id',function(req,res){
    const rentalId=req.params.id;
    
    Rental.findById(rentalId)
          .populate('user','username -_id')
          .populate('bookings','startAt endAt -_id')
          .exec(function(err,foundRentals){
            if(err){
                res.status(422).send({errors:[{title:"Rental error",detail:"this page doesn't exist"}]});
            }
            res.json(foundRentals);
        });
});

router.post('',userControl.authMiddleware,function(req,res){
    const {title,city,street,category,image,bedrooms,shared,description,dailyRate,createdAt}=req.body;
    const foundUser=res.locals.foundUser;

    const rental=new Rental({title,city,street,category,image,bedrooms,shared,description,dailyRate,createdAt});
    rental.user=foundUser;
    Rental.create(rental,function(err,createdRental){
        if(err){
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        
        User.update({_id:foundUser.id},{$push:{rentals:createdRental}},function(){});

        return res.json(createdRental)
    })
})

module.exports=router;