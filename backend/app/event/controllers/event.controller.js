const Event = require("../models/event.js");
const User = require("../../User/models/user.js");
const mongoose = require("mongoose");



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
      .sort({ date: 1 }); // sort by date

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

exports.createEvent = async (req, res, fileName) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      categories,
      maxParticipants,
    } = req.body;

    // Validate required fields
    if (!title || !date || !startTime || !location || !fileName) {
      return res
        .status(400)
        .json({
          message:
            "Title, date, startTime, location, and cover image are required.",
        });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      categories,
      coverImage: fileName, 
      maxParticipants: maxParticipants || 0, // Use provided value or default to 0
    });

    const savedEvent = await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: savedEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res
      .status(500)
      .json({ message: "Failed to create event", error: error.message });
  }
},
 
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
          user:req.body._id,
          registrationDate: new Date()
        });
        await event.save()
  
      res.status(200).json({ message: "Registration successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
