const express = require('express');

const router = express.Router();

const membershipController=require('../controllers/membership.controller');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.get('/byId/:userId',authMiddleware,membershipController.getMembershipByUserId)




module.exports = router;