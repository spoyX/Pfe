const express = require('express');

const router = express.Router();

const paymentController=require('../../payment/controllers/payment.controller')






// Endpoint to create a checkout session
router.post('/checkout', paymentController.createCheckoutSession);

// Endpoint to confirm payment after redirection from Stripe
router.post('/confirm', paymentController.confirmPayment);




module.exports = router;