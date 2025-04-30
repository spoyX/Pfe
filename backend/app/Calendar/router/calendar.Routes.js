const express = require('express');
const router = express.Router();
const calendarController = require('../controller/calendar.controller');

// @route   POST /api/events
router.post('/create', calendarController.createEvent);

// @route   GET /api/events
router.get('/getall', calendarController.getEvents);

// @route   GET /api/events/:id
router.get('/byid/:id', calendarController.getEventById);

// @route   PUT /api/events/:id
router.put('/update/:id', calendarController.updateEvent);

// @route   DELETE /api/events/:id
router.delete('/delete/:id', calendarController.deleteEvent);

module.exports = router