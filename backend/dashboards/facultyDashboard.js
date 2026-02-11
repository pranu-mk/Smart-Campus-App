const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Faculty Dashboard – Placeholder. This is private data for faculty only.");
});

module.exports = router;