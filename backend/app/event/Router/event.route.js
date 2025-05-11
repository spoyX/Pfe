const express = require('express');
const eventController = require('../controllers/event.controller');

const router = express.Router();


const multer = require('multer');
const { authMiddleware } = require('../../middlewares/authMiddleware');

let fileName = '';
const myStorage = multer.diskStorage({
    destination: './public',
    filename: (req, file, redirect)=>{
        fileName= Date.now() + '.'+ file.mimetype.split('/')[1];
        redirect(null, fileName);
    }
})
const upload = multer({storage: myStorage});

// Create a new event (admin only)
router.post('/create', authMiddleware,upload.single('coverImage'), (req, res)=>{
    eventController.createEvent(req,res,fileName);
    fileName = '';
  });
  
// Get all events
router.get('/getall',authMiddleware,eventController.getAllEvents);

//get all events without filter
router.get('/getallwithoutfilter',authMiddleware,eventController.getEvents);
// Get event details
router.get('/byid/:id',authMiddleware, eventController.getEventDetails);

router.get('/events/user', authMiddleware,eventController.getEventsByUser);

// Update event details (admin only)
router.put('/update/:id', authMiddleware,upload.single('coverImage'), (req, res)=>{
    eventController.updateEvent(req,res,fileName);
    fileName = '';
  });

// Delete an event (admin only)
router.delete('/delete/:id',authMiddleware, eventController.deleteEvent);

// Register to an event
router.post('/registre/:id', authMiddleware,eventController.registerToEvent);

module.exports = router;