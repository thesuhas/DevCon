// This is the entry file
// Importing express
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

// Initialising app variable
const app = express();

// Connect DB
connectDB();

// Init middleware
app.use(express.json({extended: false}));

// Creating get request that send data to browser for test
//app.get('/', (req, res) => res.send('API Running')); // Send a response stating that the API is running

// Define routs
app.use('/api/users', require('./routes/api/users')); // Makes api/users pertain to the get request in users.js
app.use('/api/profile', require('./routes/api/profile')); // Makes api/users pertain to the get request in profile.js
app.use('/api/auth', require('./routes/api/auth')); // Makes api/users pertain to the get request in auth.js
app.use('/api/posts', require('./routes/api/posts')); // Makes api/users pertain to the get request in posts.js

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Listening on a port
const PORT = process.env.PORT || 5000; // Looks at environment variable called port, if not set will go to 5000 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));