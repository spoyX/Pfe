const OneSignal = require('onesignal-node');
const Notification = require('../../notifcation/models/notification');
const client = new OneSignal.Client(
    process.env.ONESIGNAL_APP_ID,
    process.env.ONESIGNAL_API_KEY
  );
  
  async function sendPush(playerIds, heading, message, url,userId) {
    try {
      if (!playerIds || playerIds.length === 0) {
        console.log('No player IDs provided for push notification');
        return;
      }
      
      const notification = {
        include_player_ids: playerIds,
        headings: { en: heading },
        contents: { en: message },
        url: url,
      };
  
      console.log('Sending notification to OneSignal...');
      const response = await client.createNotification(notification);
      console.log('Push notification sent successfully:', response.body.id);
  
      // Save notification to MongoDB
      const savedNotification = await Notification.create({
        title: heading,
        message: message,
        userId: userId
      });
  
      console.log('Notification saved to DB:', savedNotification._id);
      return response;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }
  module.exports = { sendPush };