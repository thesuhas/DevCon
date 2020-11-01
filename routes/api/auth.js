// Import express
const express = require('express');

// Using express router
const router = express.Router();

// Getting middleware
const auth = require('../../middleware/auth');
// Import user model
const User = require('../../models/User');

// @route GET(request type) api/auth(end point)
// @description Test Route
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); // Adding middleware as second parameter makes it a protected route

module.exports = router;