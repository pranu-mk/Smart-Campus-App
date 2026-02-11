const express = require('express');
const router = express.Router();
const adminPollController = require('../controllers/pollController');

router.get('/', adminPollController.getAdminPolls);
router.post('/', adminPollController.createPoll);
router.patch('/:id/close', adminPollController.closePoll);
router.delete('/:id', adminPollController.deletePoll);
module.exports = router;