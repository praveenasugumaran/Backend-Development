require('dotenv').config();
const { sign, verify, TokenExpiredError } = require('jsonwebtoken');
const User = require('../models/user');

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

const validateToken = async (req, res, next) => {
    const accessToken = req.cookies['access-token'];
    if (!accessToken) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    // Verify the token
    try {
        const decoded = verify(accessToken, process.env.JWT_SECRET);
        // Find the user based on the ID in the decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Add the user to the request object
        req.user = user;
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ error: 'Access token expired' });
        } else {
            res.status(401).json({ error: 'User not authenticated' });
        }
    }
};

module.exports = { createToken, validateToken };