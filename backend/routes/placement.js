const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');

// --- THE FIX: Match the new names from authMiddleware.js ---
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/placements/upcoming
 */
router.get('/upcoming', placementController.getUpcomingPlacements);

/**
 * @route   GET /api/placements/all
 */
router.get('/all', protect, placementController.getAllPlacements);

/**
 * @route   GET /api/placements/stats
 */
router.get('/stats', protect, placementController.getPlacementStats);

/**
 * @route   POST /api/placements/apply
 */
router.post('/apply', protect, placementController.applyForPlacement);

module.exports = router;