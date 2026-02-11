const express = require('express');
const router = express.Router();
const subController = require('../controllers/subController');

router.post('/subscribe', subController.subscribe);
router.post('/admin/add-update', subController.addUpdate);

// NEW: GET route for the unsubscribe link in the email
router.get('/unsubscribe', subController.unsubscribe);

module.exports = router;