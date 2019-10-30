const express=require('express');
const Routing=require('../controllers/routing');
const BookingControl=require('../controllers/booking');

const router=express.Router();

router.post('',Routing.authMiddleware,BookingControl.createBooking);

module.exports=router;