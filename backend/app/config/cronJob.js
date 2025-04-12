const Membership = require('../memberships/Models/membership');
const User=require('../User/models/user')
const cron = require('node-cron');
const transporter=require('./email')
const fs = require('fs');
const handlebars = require('handlebars');


async function sendReminderEmail(email, expiryDate, planType) {
  try {
    // Format expiry date for the email
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Read email template
    const template = await fs.promises.readFile(
      'app/view/plan-end-soon.html',
      'utf-8'
    );

    // Compile the template with dynamic data
    const compiledTemplate = handlebars.compile(template);
    const emailHTML = compiledTemplate({
      planType: planType,
      expiryDate: formattedExpiryDate,
      email: email
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Membership Expiry Reminder',
      html: emailHTML
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    throw error; // Re-throw error for cron job to catch
  }
}

cron.schedule('36 22 * * *', async () => {
  try {
    const REMINDER_WINDOW_DAYS = 7;
    console.log('Running membership reminder job...');
    const now = new Date();
    
    // Calculate reminder threshold (e.g., 7 days from now)
    const reminderThreshold = new Date(
      now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000
    );

    // Find memberships expiring within the reminder window
    const expiringMemberships = await Membership.find({
      endDate: { $lte: reminderThreshold, $gt: now }, // Membership ends within window
      status: 'active' // Only remind active memberships
    }).populate('userId', 'email'); // Populate user's email

    if (expiringMemberships.length === 0) {
      console.log('No memberships expiring soon.');
      return;
    }

    // Send reminder emails for each expiring membership
    for (const membership of expiringMemberships) {
      const userEmail = membership.userId.email; // Get user's email
      const expiryDate = membership.endDate;

      // Send reminder email
      await sendReminderEmail(userEmail, expiryDate, membership.planType);
      console.log(`Reminder sent to ${userEmail}`);
    }

  } catch (error) {
    console.error('Error in reminder job:', error);
  }
});


