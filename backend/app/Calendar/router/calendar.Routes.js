const express = require('express');
const router = express.Router();
const calendarController = require('../controller/calendar.controller');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// @route   POST /api/events
router.post('/create',authMiddleware ,calendarController.createEvent);

// @route   GET /api/events
router.get('/getall', authMiddleware,calendarController.getEvents);

// @route   GET /api/events/:id
router.get('/byid/:id', authMiddleware,calendarController.getEventById);

// @route   PUT /api/events/:id
router.put('/update/:id',authMiddleware, calendarController.updateEvent);

// @route   DELETE /api/events/:id
router.delete('/delete/:id',authMiddleware ,calendarController.deleteEvent);

module.exports = router