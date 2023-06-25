require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');
const User = require('./user');

// Create a JWT token
const createToken = (user) => {
    if (!user) {
        throw new Error('No user data provided for token creation');
    }
    const payload = { username: user.username, id: user.id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' }; // token will expire in 1 hour
    return sign(payload, secret, options);
};

// Validate the JWT token
const jwt = require('jsonwebtoken'); // import the jwt library

const validateToken = async (req, res, next) => {
    const accessToken = req.cookies['access-token'];
    if (!accessToken) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Find the user based on the ID in the decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Add the user to the request object
        req.user = user;

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Access token expired' });
        } else {
            res.status(401).json({ error: 'User not authenticated' });
        }
    }
};


// Export the module
module.exports = { createToken, validateToken };
