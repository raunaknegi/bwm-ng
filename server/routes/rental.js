const express=require('express');
const Rental=require('../models/rental');
const userControl=require('../controllers/routing');

const router=express.Router();

router.get('/secrets',userControl.authMiddleware,function(req,res){
    res.json({"secret":true})
})

router.get('',function(req,res){
    Rental.find({},function(err,foundRentals){
        res.json(foundRentals);
    });
});

router.get('/:id',function(req,res){
    const rentalId=req.params.id;
    
    Rental.findById(rentalId,function(err,foundRentals){
        if(err){
            res.status(422).send({errors:[{title:"Rental error",detail:"this page doesn't exist"}]});
        }
        res.json(foundRentals);
    });
});

module.exports=router;