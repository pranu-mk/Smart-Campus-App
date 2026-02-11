const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

router.get('/', complaintController.getComplaints);
router.patch('/:id', complaintController.updateComplaintAction);

module.exports = router;