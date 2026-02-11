// Route Registration
const express = require('express');
const router = express.Router();
const navbarController = require('../controllers/navbarController');
router.get('/info', navbarController.getNavbarInfo);
module.exports = router;