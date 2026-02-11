const express = require('express');
const router = express.Router();
const helpdeskController = require('../controllers/helpdeskController');

// Final safety check to prevent the "argument handler must be a function" crash
if (typeof helpdeskController.getHelpdeskData !== 'function' || 
    typeof helpdeskController.updateTicketAction !== 'function') {
    console.error("DEBUG - getHelpdeskData type:", typeof helpdeskController.getHelpdeskData);
    console.error("DEBUG - updateTicketAction type:", typeof helpdeskController.updateTicketAction);
    throw new Error("CRITICAL: Helpdesk controller methods are missing. Check helpdeskController.js exports.");
}

// Map the routes
router.get('/', helpdeskController.getHelpdeskData);
router.patch('/:id', helpdeskController.updateTicketAction);

module.exports = router;