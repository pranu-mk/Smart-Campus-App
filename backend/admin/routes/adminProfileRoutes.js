const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminProfileController');

router.get('/', controller.getAdminProfile);
router.patch('/update', controller.updateAdminProfile);
router.put('/password', controller.changePassword);

module.exports = router;