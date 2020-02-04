const express=require('express');
const userControl=require('../controllers/routing');
const reviewControl=require('../controllers/review');

const router=express.Router();

router.get('',reviewControl.getUserReview);
router.get('/:id/rating',reviewControl.getRating);
router.post('',userControl.authMiddleware,reviewControl.createReview);

module.exports=router;