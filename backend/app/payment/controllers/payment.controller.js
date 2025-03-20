const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY )
const User = require('../../User/models/user');

const Payment = require('../Models/payment');
exports.createCheckoutSession = async (req, res) => {
  try {
  
    const { userId, amount } = req.body;

    
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create a Stripe Checkout Session 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Membership Payment',
            },
            unit_amount: amount, // e.g., amount in cents (e.g., 50*100 for $50)
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:4200/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/payment-cancel',
      metadata: {
        userId: userId 
      }
    });

    
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body; 
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId; 

      // Create a Payment record with the details from the session
      const paymentData = {
        paymentId: Date.now(), 
        amount: session.amount_total / 100,  
        paymentDate: new Date(),
        userId: userId,
        method: 'stripe',
        stripeTransactionId: session.payment_intent,
        status: 'successful'
      };

      const paymentRecord = new Payment(paymentData);
      await paymentRecord.save();

      return res.status(200).json({ 
        message: 'Payment successful. Payment record created. Your account is pending admin verification (max 48 hours).' 
      });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};