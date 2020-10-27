// Import express
const express = require('express');

// Using express router
const router = express.Router();

// Getting validators
const {check, validationResult} = require('express-validator/check');

// @route GET(request type) api/uses(end point)
// @description Register user
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(), // Checks if the name is present and is not empty, if not sends the error message
    check('email', 'Please enter a valid E-mail').isEmail(), // Checks if a valid email is entered
    check('password', 'Enter a password with 6 or more characters').isLength({min: 6}) // CHecks if password has atleast 6 characters
],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are errors
        return res.status(400).json({errors: errors.array()}); // 400 is a bad request
    }
    res.send('User Route');
});

module.exports = router;