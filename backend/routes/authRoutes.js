const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Renamed from verifyToken to match middleware file

// 1. PUBLIC ROUTES
router.post('/login', authController.login);
router.post('/register', authController.register);

// 2. PROTECTED ROUTES (Requires Login)
// We use the 'protect' middleware to verify the JWT token
router.put(
    '/update-profile', 
    protect, 
    authController.updateProfile
);

router.put(
    '/change-password', 
    protect, 
    authController.changePassword
);

module.exports = router;