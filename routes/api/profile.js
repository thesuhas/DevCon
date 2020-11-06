// Import express
const express = require('express');

// Getting middleware auth for privacy
const auth = require('../../middleware/auth');

// Using express router
const router = express.Router();

// Getting validation stuff
const {check, validationResult} = require('express-validator');

// Getting the model
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { route } = require('./users');

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

// @route POST api/profile
// @dev create or update user profile
// @access Private
router.post('/', [auth, 
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty(), // Needs auth middleware for private route and also checks
], async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()})
    }

    // Destructuring
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Build profile objeect and fill the fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim()); // Trim the skills of spaces and convert to array
    }

    // Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({user: req.user.id});

        // If profile exists, update it
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields},
                {new: true});
            return res.json(profile);
            }

        // Create new profile if does not exist
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route GET api/profile
// @dev get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']); // Get name and avatar of all users
        res.json(profiles);
        
    } catch (err) {
        console.err(err.message);
        res.status(500).send("Server Error");
    }
});

// @route GET api/profile/user/:user_id : used for placeholder
// @dev get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        // User id comes from the URL, hence from params
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']); // Get name and avatar of all users
        
        // If no profile
        if (!profile)
        {
            return res.status(400).json({msg: 'Profile not found'});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);

        // If the type is object id
        if (err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;