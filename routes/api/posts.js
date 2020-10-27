// Import express
const express = require('express');

// Using express router
const router = express.Router();

// @route GET(request type) api/posts(end point)
// @description Test Route
// @access Public
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;