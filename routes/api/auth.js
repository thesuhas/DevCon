// Import express
const express = require('express');

// Using express router
const router = express.Router();

// Getting middleware
const auth = require('../../middleware/auth');
// Import user model
const User = require('../../models/User');

// JWT
const jwt = require('jsonwebtoken');

// Getting bcrypt
const bcrypt = require('bcryptjs');

// Getting config
const config = require('config');

// Getting validators
const {check, validationResult} = require('express-validator/check');
const { exists } = require('../../models/User');

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

// @route POST(request type) api/auth(end point)
// @description Authenticate user and get token
// @access Public
router.post('/', [
    check('email', 'Please enter a valid E-mail').isEmail(), // Checks if a valid email is entered
    check('password', 'Password is required').exists() // Checks if the password exists
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are errors
        return res.status(400).json({errors: errors.array()}); // 400 is a bad request
    }

    const {email, password} = req.body;

    try{

    	// See if user does not exist
		let user = await User.findOne({email});
		if (!user)
		{
			return res.status(400).json({errors: [{msg: "Invalid credentials"}]});
		}

        // Need to match email and password of user
        const isMatch = await bcrypt.compare(password, user.password);

        // If no match
        if (!isMatch)
        {
            return res.status(400).json({errors: [{msg: "Invalid credentials"}]});
        }

    	// Return the json webtoken, done so that they can get logged in right away
		const payload = {
			user : {
				id: user.id
			}
		};
		jwt.sign(payload, config.get('jwtSecret'), {expiresIn : 360000}, (err, token) => {
			if (err) throw err;
			res.json({token})
		}); // Takes in payload, secret and optional options, arrow function that sends the token if no error is encountered

    } catch(err) {
		console.error(err.message);
		res.status(500).send("Server Error"); // If there is an error in registration
    }
});

module.exports = router;
