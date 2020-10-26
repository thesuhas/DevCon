// Connecting to mongoose
const mongoose = require('mongoose');

// Getting config for global var
const config = require('config');

// Getting the mongoURI link from default.json
const db = config.get('mongoURI');

// Connecting to mongoDB
const connectDb  = async () => {
    try {
    await mongoose.connect(db, {
        useNewUrlParser: true
    });

    console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Stops the app
    }
}

module.exports = connectDb;