const express=require('express');
const Routing=require('../controllers/routing')

const router=express.Router();

router.get('/:id',Routing.authMiddleware,Routing.getUser);

router.post('/auth',Routing.auth)

router.post('/register',Routing.register)

module.exports=router;