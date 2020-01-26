const express=require('express');
const Routing=require('../controllers/routing');
const PaymentControl=require('../controllers/payment');

const router=express.Router();

router.get('',Routing.authMiddleware,PaymentControl.getPendingPayments);

router.post('/accept',Routing.authMiddleware,PaymentControl.confirmPayment);
router.post('/decline',Routing.authMiddleware,PaymentControl.declinePayment);

module.exports=router;

