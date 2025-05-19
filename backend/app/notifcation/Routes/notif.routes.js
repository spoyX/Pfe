const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notif.Controller');


router.post('/create', notificationController.createNotification);


router.get('/user/:userId', notificationController.getUserNotifications);


router.put('/:id/read', notificationController.markAsRead);
router.get('/user/:userId/unread', notificationController.getUnreadNotifications);
router.delete('/delete/:id',notificationController.deleteNotification)

module.exports = router;
