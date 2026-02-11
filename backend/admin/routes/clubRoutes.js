const express = require('express');
const router = express.Router();
const adminClubController = require('../controllers/clubController');

router.get('/', adminClubController.getAdminClubs);
router.post('/', adminClubController.addClub); // New POST route
router.patch('/:id/details', adminClubController.updateClubDetails);
router.patch('/:id/status', adminClubController.toggleStatus);

module.exports = router;