const express = require('express');
const router = express.Router();
const lostFoundController = require('../controllers/lostFoundController');

router.get('/', lostFoundController.getAllItems);
router.post('/', lostFoundController.reportItem);
router.patch('/:id/status', lostFoundController.updateItemStatus);

module.exports = router;