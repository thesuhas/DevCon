// Getting mongoose for scheme
const mongoose = require('mongoose');

// Creating Profile Schema

const ProfileSchema = new mongoose.Schema({
    user: {
        // This is field type
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company : {
        type: String
    },
    website : {
        type: String
    },
    location : {
        type: String
    },
    status : {
        type: String,
        required: true
    },
    skills : {
        type: [String], // Array of strings
        required: true
    },
    bio : {
        type: String
    },
    githubusername : {
        type: String
    },
    // Array of other fields
    experience : [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    education : [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from : {
                type: Date,
                required: true
            },
            to : {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    social : {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebok: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date : {
        type: Date,
        default: Date.now // Puts the current date
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);