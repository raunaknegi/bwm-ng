const express=require('express');
const Rental=require('../models/rental');
const User=require('../models/user');
const userControl=require('../controllers/routing');
const {normalizeErrors} =require('../helpers/mongoose')

const router=express.Router();

router.get('/secrets',userControl.authMiddleware,function(req,res){
    res.json({"secret":true})
})


router.get('/manage',userControl.authMiddleware,function(req,res){
  const user=res.locals.user;
  Rental.where({user:user})
        .populate('bookings')
        .exec(function(err,foundRental){
          if(err){
              res.status(422).send({errors:[{title:"Rental error",detail:"this page doesn't exist"}]});
          }
          res.json(foundRental);  
        })
});

router.get('/:id/verify-user',userControl.authMiddleware,function(req,res){
  const user=res.locals.user;
  Rental.findById(req.params.id)
        .populate('user')
        .exec(function(err,foundRental){
            if(err){
              return res.status(422).send({ errors: normalizeErrors(err.errors) });
          }
            if(foundRental.user.id != user.id){
              return res.status(422).send({errors:[{title:"Invalid user",detail:'you are not the owner of the Rental'}]});
          }

          return res.json({status:'verified'})
        });
});

router.get('/:id',function(req,res){
  const rentalId=req.params.id;
  
  Rental.findById(rentalId)
        .populate('user','username -_id')
        .populate('bookings','startAt endAt -_id')
        .exec(function(err,foundRentals){
          if(err|| !foundRentals){
              res.status(422).send({errors:[{title:"Rental error",detail:"this page doesn't exist"}]});
          }
          res.json(foundRentals);
      });
});

router.patch('/:id',userControl.authMiddleware,function(req,res){
  const user=res.locals.user;
  const rentalData=req.body;

  Rental.findById(req.params.id)
        .populate('user')
        .exec(function(err,foundRental){
          if(err){
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
          }

          if(foundRental.user.id != user.id){
            return res.status(422).send({errors:[{title:"Invalid user",detail:`you are not the owner of the Rental ${foundRental.title}`}]});
          }

          foundRental.set(rentalData);
          foundRental.save(function(err){

            if(err){
              return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            return res.status(200).send(foundRental);            
          });
        });
});

router.delete('/:id',userControl.authMiddleware,function(req,res){
  const user=res.locals.user;

  Rental.findById(req.params.id)
        .populate('user','_id')
        .populate({
            path:'bookings',
            select:'startAt',
            match:{startAt:{$gt:new Date()}}
        })
        .exec(function(err,foundRental){
            if(err){
              return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            if(user.id != foundRental.user.id){
              return res.status(422).send({errors:[{title:"Invalid user",detail:`you are not the owner of the Rental ${foundRental.title}`}]});
            }

            if(foundRental.bookings.length>0){
              return res.status(422).send({errors:[{title:"Active Bookings",detail:`This Rental has active bookings`}]});
            }

            foundRental.remove(function(err){
                if(err){
                  return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }

                return res.json({'status':'deleted'})
              })
  });
});

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
                    return res.status(422).send({errors:[{title:"Could not find city",detail:`No rentals were found for ${city}`}]});
                  }
                  return res.json(foundRental)
              });

    
});



router.post('',userControl.authMiddleware,function(req,res){
    const {title,city,street,category,image,bedrooms,shared,description,dailyRate,createdAt}=req.body;
    const user=res.locals.user;

    const rental=new Rental({title,city,street,category,image,bedrooms,shared,description,dailyRate,createdAt});
    rental.user=user;
    Rental.create(rental,function(err,createdRental){
        if(err){
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        
        User.update({_id:user.id},{$push:{rentals:createdRental}},function(){});

        return res.json(createdRental)
    })
})

module.exports=router;