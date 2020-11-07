// Import express
const express = require('express');

// Using express router
const router = express.Router();

// Error checking
const {check, validationResult} = require('express-validator/check');

// Middleware
const auth = require('../../middleware/auth');

// Bringing in models
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @routePOST api/posts(end point)
// @description Create a post
// @access Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    // If errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    try {

        // Getting the user
        const user = await User.findById(req.user.id).select('-password');

        // Creating new post
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });    

        const post = await newPost.save();
        res.json(post);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;