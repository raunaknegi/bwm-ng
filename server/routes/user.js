const express=require('express');
const User=require('../models/user');
const Routing=require('../controllers/routing')

const router=express.Router();

router.post('/auth',Routing.auth)

router.post('/register',Routing.register)

module.exports=router;