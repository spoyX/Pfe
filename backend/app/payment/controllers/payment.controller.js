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

exports.expiredMembership = async (req, res) => {
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
      success_url: 'http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}',
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
exports.renewMembership = async (req, res) => {
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
      success_url: 'http://localhost:4200/member/subscription-succes?session_id={CHECKOUT_SESSION_ID}',
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
function generateRandomNumber() {
  return Math.floor(Math.random() * 10000); 
}

// Format the payment ID
function generatePaymentId() {
  const randomNumber = generateRandomNumber();
  
  return `#SK${String(randomNumber).padStart(4, '0')}`;
}
function generatePaymentIdNew() {
  const randomNumber = generateRandomNumber();
  
  return `#NEW${String(randomNumber).padStart(4, '0')}`;
}


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
          cardType = paymentMethod.card.brand; 
        }
        if (paymentMethod.card && paymentMethod.card.brand) {
          cardType = paymentMethod.card.brand; 
          cardLastFour = paymentMethod.card.last4; // Extract the last four digits
        }
      }

      // Create a Payment record with the details from the session
      const paymentData = {
        paymentId: generatePaymentId(),
        amount: session.amount_total / 100,
        paymentDate: new Date(),
        userId: userId,
        method: 'stripe',
        cardType: cardType, // Store the card type
        cardLastFour:cardLastFour,
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
    const payments = await Payment.find().populate('userId', 'username email firstName lastName ');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // Find the payment
    const payment = await Payment.findById(paymentId).populate('userId', 'username email firstName lastName idType city profileImage country job gender dateOfBirth phone createdAt _id status');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find all payments for the given user, sorted by paymentDate in descending order.
    const payments = await Payment.find({ userId: userId })
      .populate('userId', 'username email firstName lastName')
      .sort({ paymentDate: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }

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

exports.getUserPaymentHistory = async (req, res) => {
  try {
    // Expect the user ID to be provided in the URL parameters
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find all payments for this user, sort by paymentDate (newest first)
    const payments = await Payment.find({ userId: userId })
      .populate('userId', 'username email firstName lastName')
      .sort({ paymentDate: -1 });

    // Return the payments as JSON
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.confirm = async (req, res) => {
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
      let cardLastFour = ''; 
      
      if (session.payment_intent && session.payment_intent.payment_method) {
        // Retrieve the payment method to get card details
        const paymentMethod = await stripe.paymentMethods.retrieve(
          session.payment_intent.payment_method
        );
        
        if (paymentMethod.card && paymentMethod.card.brand) {
          cardType = paymentMethod.card.brand; 
          cardLastFour = paymentMethod.card.last4; // Extract the last four digits
        }
      }

      // Create a Payment record with the details from the session
      const paymentData = {
        paymentId: generatePaymentIdNew(),
        amount: session.amount_total / 100,
        paymentDate: new Date(),
        userId: userId,
        method: 'stripe',
        cardType: cardType, // Store the card type
        cardLastFour: cardLastFour, // Store the last four digits
        stripeTransactionId: session.payment_intent.id || session.payment_intent,
        status: 'successful'
      };

      const paymentRecord = new Payment(paymentData);
      await paymentRecord.save();

      // Update the membership
      await updateMembership(userId, paymentRecord.amount);

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
// Function to update membership
async function updateMembership(userId, amount) {
  try {
    // Calculate membership duration based on amount
    let duration;
    let planType;
    switch (amount) {
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

    // Update the membership
    await Membership.updateOne(
      { userId: userId },
      {
        $set: {
          startDate,
          endDate,
          planType,
          status: 'active'
        }
      },
      { upsert: true }
    );

    // Update user status to active
    
    const user = await User.findById(userId);
    if (user) {
      user.status = 'active';
      await user.save();
    }

    return true;
  } catch (error) {
    console.error('Error updating membership:', error);
    throw error;
  }
}
exports.confirmRenew = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Retrieve the Stripe session (expanding payment_intent for card details)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    // Check if the payment was successful
    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      
      // Get card details from the payment intent
      let cardType = '';
      let cardLastFour = '';
      if (session.payment_intent && session.payment_intent.payment_method) {
        const paymentMethod = await stripe.paymentMethods.retrieve(
          session.payment_intent.payment_method
        );
        if (paymentMethod.card && paymentMethod.card.brand) {
          cardType = paymentMethod.card.brand;
          cardLastFour = paymentMethod.card.last4;
        }
      }

      // Create a Payment record for the renewal
      const paymentData = {
        paymentId: generatePaymentIdNew(),
        amount: session.amount_total / 100,
        paymentDate: new Date(),
        userId: userId,
        method: 'stripe',
        cardType: cardType,
        cardLastFour: cardLastFour,
        stripeTransactionId: session.payment_intent.id || session.payment_intent,
        status: 'successful'
      };

      const paymentRecord = new Payment(paymentData);
      await paymentRecord.save();

      // Determine the base duration and planType based on payment amount
      let baseDuration; // in days
      let planType;
      switch (paymentRecord.amount) {
        case 9:
          baseDuration = 30;
          planType = 'monthly';
          break;
        case 24:
          baseDuration = 90;
          planType = '3months';
          break;
        case 42:
          baseDuration = 180;
          planType = '6months';
          break;
        default:
          baseDuration = 30;
          planType = 'monthly';
      }

      const now = new Date();
      let newEndDate;
      // Check if user has an active membership with remaining days
      const membership = await Membership.findOne({ userId: userId });
      if (membership && membership.status === 'active' && membership.endDate > now) {
        // Calculate remaining days
        const remainingTime = membership.endDate.getTime() - now.getTime();
        const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        // New duration is base duration + remaining days
        newEndDate = new Date(now.getTime() + (baseDuration + remainingDays) * 24 * 60 * 60 * 1000);
      } else {
        // Otherwise, simply set new end date as now + base duration
        newEndDate = new Date(now.getTime() + baseDuration * 24 * 60 * 60 * 1000);
      }

      // Update the membership record (or create one if it doesn't exist)
      if (membership) {
        membership.startDate = now;
        membership.endDate = newEndDate;
        membership.planType = planType;
        membership.status = 'active';
        await membership.save();
      } else {
        
        const newMembership = new Membership({
          membershipId: Date.now(), // Or use another generator
          userId: userId,
          planType: planType,
          startDate: now,
          endDate: newEndDate,
          status: 'active'
        });
        await newMembership.save();
      }

      // Update user status to active
      const user = await User.findById(userId);
      if (user) {
        user.status = 'active';
        await user.save();
      }

      return res.status(200).json({
        message: 'Renewal payment successful. Membership has been updated.'
      });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error("Error confirming renewal payment:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};