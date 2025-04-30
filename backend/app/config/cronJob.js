const Membership = require('../memberships/Models/membership');
const User = require('../User/models/user');
const cron = require('node-cron');
const transporter = require('./email');
const fs = require('fs');

const handlebars = require('handlebars');
const twilio = require('twilio');
const { sendPush } = require('../config/lib/oneSignal');
// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);




async function sendReminderEmail(email, expiryDate, planType) {
  try {
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const template = await fs.promises.readFile(
      'app/view/plan-end-soon.html',
      'utf-8'
    );

    const compiledTemplate = handlebars.compile(template);
    const emailHTML = compiledTemplate({
      planType: planType,
      expiryDate: formattedExpiryDate,
      email: email
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Membership Expiry Reminder',
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    throw error;
  }
}
function normalizePhone(raw) {
  raw = raw.trim();
  if (raw.startsWith('+')) return raw;
  raw = raw.replace(/^0+/, '');      // strip leading zeros
  return '+216' + raw;               // assume Tunisia
}
async function sendReminderSMS(phoneNumber, expiryDate, planType) {
  try {
    const to = normalizePhone(phoneNumber);
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `
      Your CCCT ${planType} membership is expiring on ${formattedExpiryDate}.
      Renew your membership to continue enjoying all benefits.
    `;

    await client.messages.create({
      body: message,
      from:twilioPhoneNumber,
      to: to
    });

    console.log(`Reminder SMS sent to ${phoneNumber}`);
  } catch (error) {
    console.error('Failed to send reminder SMS:', error);
    throw error;
  }
}

cron.schedule('58 18 * * *', async () => {
  try {
    const REMINDER_WINDOW_DAYS = 7;
    console.log('Running membership reminder job...');
    const now = new Date();
    const reminderThreshold = new Date(
      now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000
    );

    const expiringMemberships = await Membership.find({
      endDate: { $lte: reminderThreshold, $gt: now },
      status: 'active'
    }).populate('userId', 'email phone oneSignalPlayerIds'); // Populate user's email and phone

    if (expiringMemberships.length === 0) {
      console.log('No memberships expiring soon.');
      return;
    }

    for (const membership of expiringMemberships) {
      const userEmail = membership.userId.email;
      const userPhone = membership.userId.phone;
      const expiryDate = membership.endDate;
      const userId = membership.userId._id;
      const playerIds = membership.userId.oneSignalPlayerIds || [];
      console.log('Player IDs:', playerIds);
      if (playerIds.length) {
        await sendPush(
          playerIds,
           'Votre adhésion CCCT expire bientôt',
          `Votre adhésion ${membership.planType} expire le ${expiryDate.toLocaleDateString()}.`,
          'http://localhost:4200/member',
          userId
        
          
        );
        console.log(`Push sent to ${playerIds}`);
      }
    

      // await sendReminderEmail(userEmail, expiryDate, membership.planType);
      // console.log(`Reminder sent to ${userEmail}`);

      // if (userPhone) {
      //   await sendReminderSMS(userPhone, expiryDate, membership.planType);
      //   console.log(`Reminder sent to ${userPhone}`);
      // }
      
    }

  } catch (error) {
    console.error('Error in reminder job:', error);
  }
});