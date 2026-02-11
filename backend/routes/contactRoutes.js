const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// This responds to: POST https://smart-campus-backend-app.onrender.com/api/contact/send-sms
router.post('/send-sms', contactController.sendContactSMS);

module.exports = router;