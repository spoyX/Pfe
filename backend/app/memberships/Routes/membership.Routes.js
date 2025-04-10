const express = require('express');

const router = express.Router();

const membershipController=require('../controllers/membership.controller')

router.get('/byId/:userId',membershipController.getMembershipByUserId)




module.exports = router;