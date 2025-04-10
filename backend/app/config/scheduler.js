const cron = require('node-cron');
const Membership = require('../memberships/Models/membership');
const User=require('../User/models/user')
async function updateExpiredMemberships() {
  try {
    const now = new Date();
    await Membership.updateMany(
      { endDate: { $lte: now }, status: 'active' },
      { $set: { status: 'expired' } }
    );
    await User.updateMany(
      { 'memberships.status': 'expired', status: 'active' },
      { $set: { status: 'expired' } }
    );
    console.log('Expired memberships updated successfully');
  } catch (error) {
    console.error('Error updating expired memberships:', error);
  }
}

function startScheduler() {
  // Schedule the task to run every day at midnight using a cron expression:
  cron.schedule('10 18 * * *', () => {
    console.log('Running scheduled task: updateExpiredMemberships');
    updateExpiredMemberships();
  });

  
  // updateExpiredMemberships();
}

module.exports = { startScheduler };