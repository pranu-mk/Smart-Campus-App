const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');

// Standard GET for the list and PATCH for the status buttons
router.get('/', placementController.getAdminPlacements);
router.patch('/:id/status', placementController.updatePlacementStatus);
router.post('/', placementController.createPlacementDrive);
router.patch('/:id', placementController.editPlacementDrive);
module.exports = router;