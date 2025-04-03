const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY )
const User = require('../../User/models/user');
const Payment = require('../Models/payment');
const Membership=require('../../memberships/Models/membership')
const transporter = require('../../config/email')
const fs = require('fs');
const handlebars = require('handlebars');

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
      cancel_url: 'http://localhost:4200/payment-fail',
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
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'] // Expand the payment_intent to get payment method details
    });

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      
      // Get card details from payment intent
      let cardType = '';
      
      if (session.payment_intent && session.payment_intent.payment_method) {
        // Retrieve the payment method to get card details
        const paymentMethod = await stripe.paymentMethods.retrieve(
          session.payment_intent.payment_method
        );
        
        if (paymentMethod.card && paymentMethod.card.brand) {
          cardType = paymentMethod.card.brand; // This will be 'visa', 'mastercard', 'amex', etc.
        }
      }

      // Create a Payment record with the details from the session
      const paymentData = {
        paymentId: Date.now(),
        amount: session.amount_total / 100,
        paymentDate: new Date(),
        userId: userId,
        method: 'stripe',
        cardType: cardType, // Store the card type
        stripeTransactionId: session.payment_intent.id || session.payment_intent,
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

exports.getPayments = async (req,res) => {
  try {
    const payments = await Payment.find().populate('userId', 'username email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.validatePayment = async (req,res) => {
  try {
    const paymentId = req.params.id;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // Find the payment
    const payment = await Payment.findById(paymentId).populate('userId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }



    // Calculate membership duration based on amount
    let duration;
    let planType;
    switch (payment.amount) {
      case 9:
        duration = 30;
        planType = 'monthly';
        break;
      case 24:
        duration = 90;
        planType = '3months';
        break;
      case 42:
        duration = 180;
        planType = '6months';
        break;
      default:
        duration = 30;
        planType = 'monthly';
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);

    // Create a new membership record
    const membership = new Membership({
      membershipId: Date.now(),
      userId: payment.userId._id,
      planType,
      startDate,
      endDate,
      status: 'active'
    });
    await membership.save();

    // Update user status to active
    payment.userId.status = 'active';
    await payment.userId.save();

    // Read the email template
    const template = await fs.promises.readFile('app/view/email-template.html', 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    const emailHTML = compiledTemplate({
      amount: payment.amount,
      planType: planType,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString()
    });

    // Send welcome email with receipt
    const mailOptions = {
      from: 'adembenchiboub74@gmail.com',
      to: payment.userId.email,
      subject: 'Welcome to CCCT! Your Payment Receipt',
      html: emailHTML
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Payment validated and membership activated' });
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};