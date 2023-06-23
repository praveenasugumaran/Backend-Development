require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

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
const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];
    if (!accessToken) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify the token
    try {
        verify(accessToken, process.env.JWT_SECRET);
        req.authenticated = true;
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
