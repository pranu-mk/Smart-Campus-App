const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// All routes here are prefixed with /api/admin/students in server.js
router.get('/', studentController.getStudents);
router.get('/:id/complaints', studentController.getStudentComplaints);
router.put('/:id', studentController.updateStudentDetails);

module.exports = router;