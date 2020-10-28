// Import express
const express = require('express');
const config = require('config');

// Using express router
const router = express.Router();

// Getting validators
const {check, validationResult} = require('express-validator/check');

// Get user schema
const User = require('../../models/User'); // .. is to go up by a folder

// Importing gravatar
const gravatar = require('gravatar');

// Importing bcrypt
const bcrypt = require('bcryptjs');

// Getting JWT
const JWT = require('jsonwebtoken');

// @route POST(request type) api/uses(end point)
// @description Register user
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(), // Checks if the name is present and is not empty, if not sends the error message
    check('email', 'Please enter a valid E-mail').isEmail(), // Checks if a valid email is entered
    check('password', 'Enter a password with 6 or more characters').isLength({min: 6}) // Checks if password has atleast 6 characters
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are errors
        return res.status(400).json({errors: errors.array()}); // 400 is a bad request
    }

    const {name, email, password} = req.body;

    try{

    	// See if user exists
		let user = await User.findOne({email});
		if (user)
		{
			return res.status(400).json({errors: [{msg: "User already exists"}]});
		}

    	// Get users gravatar
		const avatar = gravatar.url(email, {
			s: '200', // Size
			r: 'pg', // Rating
			d: 'mm' // Gives a default image
		});

		// Create instance of User
		user = new User({
			name,
			email,
			avatar,
			password
		});

    	// Encrypt the password with bcrypt
		const salt = await bcrypt.genSalt(10); // Salt for hashing, 10 is recommended

		user.password = await bcrypt.hash(password, salt);

		// Saving user to DB
		await user.save();

    	// Return the json webtoken, done so that they can get logged in right away
		const payload = {
			user : {
				id: user.id
			}
		}
		JWT.sign(payload, config.get('jwtSecret'), {expiresIn : 360000}, (err, token) => {
			if (err) throw err;
			res.json({token})
		}); // Takes in payload, secret and optional options, arrow function that sends the token if no error is encountered

    } catch(err) {
		console.error(err.message);
		res.status(500).send("Server Error"); // If there is an error in registration
    }
});

module.exports = router;