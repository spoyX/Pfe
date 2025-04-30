
const Calendar = require('../model/calendar');
const { sendPush } = require('../../config/lib/oneSignal');
const User = require('../../User/models/user'); 
exports.createEvent = async (req, res) => {
  try {
      const eventData = {
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
          allDay: req.body.allDay,
          description: req.body.description,
          location: req.body.location,
      };

      const event = new Calendar(eventData);
      await event.save();

      // Fetch all users with OneSignal player IDs and their _id
      const users = await User.find({}).select('_id oneSignalPlayerIds');
      const playerIds = users.flatMap(user => user.oneSignalPlayerIds).filter(id => id);
      const userIds = users.map(user => user._id); // Collect all user IDs

      // Send push notifications
      if (playerIds.length > 0 && userIds.length > 0) {
          try {
              await sendPush(
                  playerIds,
                  'New Calendar Event Added', // Notification title
                  `A new event titled "${event.title}" has been added to the calendar!`, // Message
                  `member/calendar`, // URL to the calendar event
                  userIds // Pass the array of userIds
              );
          } catch (error) {
              console.error('Failed to send notifications:', error);
          }
      }

      // Send the response after all operations are complete
      return res.status(201).json(event);
  } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ message: error.message });
  }
};
  
  // Get all events
  exports.getEvents = async (req, res) => {
    try {
      const events = await Calendar.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get single event
  exports.getEventById = async (req, res) => {
    try {
      const event = await Calendar.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update event
  exports.updateEvent = async (req, res) => {
    try {
      const event = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete event
  exports.deleteEvent = async (req, res) => {
    try {
      const event = await Calendar.findByIdAndDelete(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };