// Import JWT
const jwt = require('jsonwebtoken');

// Get config for secret
const config = require('config');

module.exports = function (req, res, next) {
    // Get token from header, header key that we want to send token in
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) {
        return res.status(401).json({msg: 'No token, authorisation denied'});
    }

    // If token exists, verify it
    try {
        // Decodes the token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        res.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }

}