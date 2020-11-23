// Import express
const express = require('express');

// Getting middleware auth for privacy
const auth = require('../../middleware/auth');

// Using express router
const router = express.Router();

// Getting validation stuff
const {check, validationResult} = require('express-validator');

// Getting request
const request = require('request');

// Getting config
const config = require('config');
// Normalize url
const normalize = require('normalize-url');

// Getting the model
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
//const { route } = require('./users');
const { response } = require('express');

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
    if (website) profileFields.website = normalize(website, { forceHttps:true});
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim()); // Trim the skills of spaces and convert to array
    }

    // Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = normalize(youtube, { forceHttps:true});
    if (twitter) profileFields.social.twitter = normalize(twitter, { forceHttps:true});
    if (facebook) profileFields.social.facebook = normalize(facebook, { forceHttps:true});
    if (linkedin) profileFields.social.linkedin = normalize(linkedin, { forceHttps:true});
    if (instagram) profileFields.social.instagram = normalize(instagram, { forceHttps:true});

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

// @route DELETE api/profile
// @dev Delete profile, user & posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        // Deleting posts
        await Post.deleteMany({user: req.user});

        // Remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        // Remove user
        await User.findOneAndRemove({_id: req.user.id});
        
        res.json({msg: "User Deleted"});  
    } catch (err) {
        console.err(err.message);
        res.status(500).send("Server Error");
    }
});

// @route PUT api/profile/experience
// @dev Add profile experience
// @access Private
router.put('/experience', [auth,
    [check('title', 'Title is required').not().isEmpty(),
check('company', 'Company is required').not().isEmpty(),
check('from', 'From date is required').not().isEmpty()]
], async (req, res) => {
    const errors = validationResult(req);
    // If errors are present
    if (!errors.isEmpty){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {title, company, location, from, to, current, description} = req.body;

    // Creates object with data that user submits
    const newExp = {
        title, company, location, from, to, current, description
    };

    try{
        const profile = await Profile.findOne({user: req.user.id});

        // Experience is an array, unshit adds at beginning
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route DELETE api/profile/experience/:exp_id
// @dev Delete experience from profile
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id});

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT api/profile/education
// @dev Add profile education
// @access Private
router.put('/education', [auth,
    [check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required')]
], async (req, res) => {
    const errors = validationResult(req);
    // If errors are present
    if (!errors.isEmpty){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;

    // Creates object with data that user submits
    const newEdu = {
        school, degree, fieldofstudy, from, to, current, description
    };

    try{
        const profile = await Profile.findOne({user: req.user.id});

        // Experience is an array, unshit adds at beginning
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
        } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route DELETE api/profile/education/:edu_id
// @dev Delete education from profile
// @access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id});

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/profile/github/:username
// @dev Get user repos from github
// @access Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };

        request(options, (error, response, body) => {
            if (error){
                console.error(error);
            }

            if (response.statusCode != 200) {
                return res.status(404).json({msg: 'No Github profile found'})
            }
            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;