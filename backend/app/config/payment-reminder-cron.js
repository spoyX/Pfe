const cron = require("node-cron");
const nodemailer = require("nodemailer");
const transporter = require("./email");

// Import models
const User = require("../User/models/user");
const Payment = require("../payment/Models/payment");

const REMINDER_DAYS = 3;
const DELETION_WARNING_DAYS = 9;
const ACCOUNT_DELETION_DAYS = 14;

// Function to send email
const sendEmail = async (user, emailType) => {
  try {
    let subject, htmlContent;

    switch (emailType) {
      case "reminder":
        subject = "Complete Your Registration Process";
        htmlContent = `
        <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    .button {
      display: inline-block;
      background-color: #0a2463;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h2>Hello ${user.firstName || user.username},</h2>
  <p>We noticed you started the registration process but haven't completed the payment yet.</p>
  <p>To enjoy all the benefits of our platform, please complete your payment by clicking the button below:</p>
  <p>
    <a  rel="noopener noreferrer"href="${process.env.WEBSITE_URL}/subscriptionplan/${
          user._id
        }" class="button">Complete Payment</a>
  </p>
  <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
  <p>Thank you,<br>The Team</p>
</body>
</html>
        `;
        break;
      case "deletion_warning":
        subject = "Action Required: Your Account Will Be Deleted Soon";
        htmlContent = `
       <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    .button {
      display: inline-block;
      background-color: #0a2463;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h2>Hello ${user.firstName || user.username},</h2>
  <p>We noticed you started the registration process but haven't completed the payment yet.</p>
  <p>To enjoy all the benefits of our platform, please complete your payment by clicking the button below:</p>
  <p>
    <a rel="noopener noreferrer" href="${process.env.WEBSITE_URL}/subscriptionplan/${
          user._id
        }" class="button">Complete Payment</a>
  </p>
  <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
  <p>Thank you,<br>The Team</p>
</body>
</html>
        `;
        break;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
cron.schedule("30 19 * * *", async () => {
  try {
    console.log("Running payment reminder cron job...");

    // Get all users except admins
    const allUsers = await User.find({ role: { $ne: "admin" } });

    // Process each user
    for (const user of allUsers) {
      // Check if user has any payment record
      const payment = await Payment.findOne({ userId: user._id });

      if (!payment) {
        // Calculate days since user registration
        const registrationDate = new Date(user.createdAt);
        const currentDate = new Date();
        const daysSinceRegistration = Math.floor(
          (currentDate - registrationDate) / (1000 * 60 * 60 * 24)
        );

        // Determine which notification to send based on time elapsed
        if (daysSinceRegistration === REMINDER_DAYS) {
          // First reminder after REMINDER_DAYS
          await sendEmail(user, "reminder");
          console.log(
            `Sent reminder to ${user.email} after ${REMINDER_DAYS} days`
          );
        } else if (daysSinceRegistration === DELETION_WARNING_DAYS) {
          // Final warning after DELETION_WARNING_DAYS
          await sendEmail(user, "deletion_warning");
          console.log(
            `Sent deletion warning to ${user.email} after ${DELETION_WARNING_DAYS} days`
          );
        } else if (daysSinceRegistration >= ACCOUNT_DELETION_DAYS) {
          // Delete the user account after ACCOUNT_DELETION_DAYS
          console.log(
            `Deleting account for ${user.email} after ${ACCOUNT_DELETION_DAYS} days`
          );
          await User.deleteOne({ _id: user._id });
        }
      }
    }

    console.log("Payment reminder cron job completed");
  } catch (error) {
    console.error("Error processing incomplete registrations:", error);
  }
});
