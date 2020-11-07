// Bring in mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creating post model
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users' // Links to the user
    },
    text: {
        type: String,
        required: true
    },
    // Name of user
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    // Array of likes
    likes : [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments : [ {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);