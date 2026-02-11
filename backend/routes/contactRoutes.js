const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// This responds to: POST http://localhost:5000/api/contact/send-sms
router.post('/send-sms', contactController.sendContactSMS);

module.exports = router;