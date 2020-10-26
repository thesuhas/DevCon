// This is the entry file
// Importing express
const express = require('express');

// Initialising app variable
const app = express();

// Creating get request that send data to browser for test
app.get('/', (req, res) => res.send('API Running')); // Send a response stating that the API is running

// Listening on a port
const PORT = process.env.PORT || 5000; // Looks at environment variable called port, if not set will go to 5000 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));