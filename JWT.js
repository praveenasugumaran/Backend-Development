require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

const createToken = (user) => {
    const accessToken = sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // token will expire in 1 hour
    );
    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];

    if (!accessToken) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const verifiedToken = verify(accessToken, process.env.JWT_SECRET);

        if (verifiedToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Access token expired' });
        } else {
            return res.status(401).json({ error: 'User not authenticated' });
        }
    }
};

module.exports = { createToken, validateToken };
