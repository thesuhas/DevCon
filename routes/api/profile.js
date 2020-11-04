// Import express
const express = require('express');

// Getting middleware auth for privacy
const auth = require('../../middleware/auth');

// Using express router
const router = express.Router();

// Getting the model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET(request type) api/profile/me(end point) Note: api/profile gets all profiles
// @description get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']); // Searches for object id of the profile schema, gets name and avatar of the corresponding user

        // If no profile
        if (!profile)
        {
            return res.status(400).json({msg: 'There is no profile for this user'})
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;