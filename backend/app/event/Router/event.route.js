const express = require('express');
const eventController = require('../controllers/event.controller');

const router = express.Router();


const multer = require('multer')

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
router.post('/create', upload.single('coverImage'), (req, res)=>{
    eventController.createEvent(req,res,fileName);
    fileName = '';
  });
  
// Get all events
router.get('/getall',eventController.getAllEvents);

// Get event details
router.get('/byid/:id', eventController.getEventDetails);



// Update event details (admin only)
router.put('/update/:id', upload.single('coverImage'), (req, res)=>{
    eventController.updateEvent(req,res,fileName);
    fileName = '';
  });

// Delete an event (admin only)
router.delete('/delete/:id', eventController.deleteEvent);

// Register to an event
router.post('/registre/:id', eventController.registerToEvent);

module.exports = router;