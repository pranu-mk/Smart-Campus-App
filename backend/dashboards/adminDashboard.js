const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Admin Dashboard – Placeholder. This is private data for admins only.");
});

module.exports = router;