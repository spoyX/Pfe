const Event = require("../models/event.js");
const User = require("../../User/models/user.js");
const mongoose = require("mongoose");
const Calendar=require('../../Calendar/model/calendar');

const { sendPush } = require('../../config/lib/oneSignal');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    // Get query parameters from the request
    const { title, categories, date } = req.query;

    // Build the filter object based on query parameters
    const filter = {};

   
    if (title) {
      filter["title"] = { $regex: new RegExp(title, "i") }; // Case-insensitive search
    }

  
    if (categories) {
      filter["categories"] = categories;
    }

  
    if (date) {
      const searchDate = new Date(date);
      const startDate = new Date(searchDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(searchDate);
      endDate.setHours(23, 59, 59, 999);

      filter["date"] = { $gte: startDate, $lte: endDate };
    }

    // Find events with the built filter and populate registrations
    const events = await Event.find(filter)
      .populate(
        'registrations'
,        "username email firstName lastName profileImage"
      )
      .sort({ date: -1 }); // sort by date

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getEvents= async (req, res) => {
  try {
    const events = await Event.find({})
      .populate(
        'registrations.user', // Populate the user field in registrations
        "username email firstName lastName profileImage job" // Specify the fields to populate
      )
   
      res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};
// Get event details with populated users
exports.getEventDetails = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id) .populate(
        'registrations.user'
,        "username email firstName lastName profileImage job"
      ) 
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getEventsByUser = async (req, res) => {
    try {
      const userId =req.user._id; 
  
      
      const events = await (await Event.find({ "registrations.user": userId })).length
       
       
  
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events for user:", error); // Log the error for debugging
      res.status(500).json({ message: "Failed to fetch events", error: error.message });
    }
  };

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      endTime,
      startTime,
      
      location,
      categories,
      maxParticipants,
    } = req.body;

    // Validate required fields
    if (!title || !date || !startTime || !endTime || !location) {
      return res.status(400).json({
        message: "Title, date, startTime, endTime, and location are required.",
      });
    }

    // Parse the date string into a Date object
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Parse startTime and endTime into Date objects
    const startTimeObject = new Date(eventDate.getTime());
    startTimeObject.setHours(startTime.split(":")[0], startTime.split(":")[1], 0, 0);
    const endTimeObject = new Date(eventDate.getTime());
    endTimeObject.setHours(endTime.split(":")[0], endTime.split(":")[1], 0, 0);

    // Check if startTime is before endTime
    if (startTimeObject >= endTimeObject) {
      return res.status(400).json({
        message: "Start time must be before end time.",
      });
    }

    // Create a new event
    const newEvent = new Event({
      title,
      description,
      date: eventDate,
      startTime,
      endTime,
      location,
      categories,
      coverImage: req.file ? req.file.filename : '', // Assuming you're using Multer for file uploads
      maxParticipants: maxParticipants || 0, // Use provided value or default to 0
    });

    // Save the event
    const savedEvent = await newEvent.save();

    // Create a new calendar entry
    const newCalendarEntry = new Calendar({
      title: savedEvent.title,
      start: startTimeObject,
      end: endTimeObject,
      allDay: false,
      description: savedEvent.description,
      location: savedEvent.location,
    });

    // Save the calendar entry
    const savedCalendarEntry = await newCalendarEntry.save();

     // Fetch all users with OneSignal player IDs and their _id
         const users = await User.find({ role: { $ne: 'admin' } }).select('_id oneSignalPlayerIds');

          const playerIds = users.flatMap(user => user.oneSignalPlayerIds).filter(id => id);
          const userIds = users.map(user => user._id); // Collect all user IDs
    
          // Send push notifications
          if (playerIds.length > 0 && userIds.length > 0) {
              try {
                  await sendPush(
                      playerIds,
                      'New  Event Added', // Notification title
                      `A new event titled "${newEvent.title}" has been added!`, // Message
                      `member/event-list`, // URL to the calendar event
                      userIds // Pass the array of userIds
                  );
              } catch (error) {
                  console.error('Failed to send notifications:', error);
              }
          }

    res.status(201).json({
      message: "Event created successfully and added to calendar",
      event: savedEvent,
      calendarEntry: savedCalendarEntry,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};
 
  (exports.updateEvent = async (req, res, fileName) => {
    try {
      
      const eventId = req.params.id;
      eventdata = req.body;

      if (req.file) {
        
        eventdata.coverImage = fileName; 
      }

  
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId, // Use the ID directly
        eventdata, // Update data
        {
          new: true, // Return the updated document
          runValidators: true, 
        }
      );

      // Check if the event exists
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Respond with the updated event
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error); // Log the full error for debugging
      res.status(400).json({ message: error.message });
    }
  });

// Delete an event (admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Register user to event
exports.registerToEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      // Calculate registration deadline (one day before the event)
      const registrationDeadline = new Date(event.date);
      registrationDeadline.setDate(registrationDeadline.getDate() - 1);
     
      // Check if registration is allowed
      const currentDate = new Date();
      if (currentDate > registrationDeadline) {
        return res
          .status(401)
          .json({ message: "Registration deadline has passed" });
      }
      // Check if event is full
      if (
        event.registrations.length >= event.maxParticipants &&
        event.maxParticipants > 0
      ) {
        return res.status(400).json({ message: "Event is full" });
      }
  
  
      // Add user to event registrations
      event.registrations.push({
          user:req.user._id,
          registrationDate: new Date()
        });
        await event.save()
  
      res.status(200).json({ message: "Registration successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
