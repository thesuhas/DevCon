// Import express
const express = require('express');

// Using express router
const router = express.Router();

// @route GET(request type) api/auth(end point)
// @description Test Route
// @access Public
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;