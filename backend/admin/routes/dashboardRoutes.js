const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// All routes here are already prefixed with /api/admin from server.js
router.get('/summary', dashboardController.getDashboardData);

module.exports = router;