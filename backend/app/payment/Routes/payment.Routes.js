const express = require('express');

const router = express.Router();

const paymentController=require('../../payment/controllers/payment.controller');
const { authMiddleware } = require('../../middlewares/authMiddleware');






// Endpoint to create a checkout session
router.post('/checkout', paymentController.createCheckoutSession);
router.post('/checkout-expired', paymentController.expiredMembership);
router.post('/checkout-renew',paymentController.renewMembership)

// Endpoint to confirm payment after redirection from Stripe
router.post('/confirm', paymentController.confirmPayment);
router.post('/confirm-expired', paymentController.confirm);
router.post('/confirm-renew',paymentController.confirmRenew);


router.get('/allpayments',authMiddleware,paymentController.getPayments)
router.post('/validate/:id',authMiddleware,paymentController.validatePayment)
router.get('/byId/:id', authMiddleware,paymentController.getPaymentById);
router.get('/byUser/:userId',authMiddleware, paymentController.getPaymentsByUserId);
router.get('/history/:userId',authMiddleware, paymentController.getUserPaymentHistory);



module.exports = router;