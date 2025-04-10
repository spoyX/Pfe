const express = require('express');
const chatController = require('../controller/chat.controller');


const router = express.Router();

router.post('/send',  chatController.sendMessage);
router.get('/recent',  chatController.getRecentMessages);

module.exports = router;