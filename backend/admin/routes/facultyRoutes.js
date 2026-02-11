const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

router.get('/', facultyController.getFacultyMembers);
router.patch('/:id/status', facultyController.updateFacultyStatus);

module.exports = router;