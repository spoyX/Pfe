const express = require('express');

const router = express.Router();

const paymentController=require('../../payment/controllers/payment.controller')






// Endpoint to create a checkout session
router.post('/checkout', paymentController.createCheckoutSession);
router.post('/checkout-expired', paymentController.expiredMembership);


// Endpoint to confirm payment after redirection from Stripe
router.post('/confirm', paymentController.confirmPayment);
router.post('/confirm-expired', paymentController.confirm);


router.get('/allpayments',paymentController.getPayments)
router.post('/validate/:id',paymentController.validatePayment)
router.get('/byId/:id', paymentController.getPaymentById);

router.get('/history/:userId', paymentController.getUserPaymentHistory);



module.exports = router;