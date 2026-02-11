const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

router.get('/', noticeController.fetchNotices);
router.post('/', noticeController.addNotice);
router.put('/:id', noticeController.editNotice);
router.delete('/:id', noticeController.removeNotice);

module.exports = router;