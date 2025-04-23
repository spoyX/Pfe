
const express = require('express');

const router = express.Router();
const User=require('../../User/models/user')

router.post('/register', async (req, res) => {
    try {
      const { userId, playerId } = req.body;
      await User.findByIdAndUpdate(userId, { $addToSet: { oneSignalPlayerIds: playerId } });
      res.sendStatus(204);
    } catch (error) {
      console.error('Failed to register player ID:', error);
      res.status(500).send('Registration failed');
    }
  });

  module.exports = router;