const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { createToken } = require('../middleware/JWT');
const createRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Create a rate limiter for 10 requests per 15 minutes
limiter = createRateLimiter(10, 15);

// Login route
router.post("/login", limiter, async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    // Try to authenticate the user
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, userExists.password);
            if (isPasswordMatch) {
                const accessToken = createToken(userExists, process.env.SECRET_KEY);
                // Set the access token as a cookie
                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict'
                });
                return res.status(200).json({ message: 'User successfully logged in' });
            } else {
                return res.status(400).json({ message: 'Invalid password' });
            }
        } else {
            return res.status(400).json({ message: 'User does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

// Signup route
router.post("/sign-up", limiter, async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    // Try to create a new user
    try {
        const [existingEmail, existingUsername] = await Promise.all([
            User.findOne({ email: req.body.email }),
            User.findOne({ username: req.body.username })
        ]);
        if (existingEmail || existingUsername) {
            return res.status(400).json({ message: 'User already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            await newUser.save();
            return res.status(200).json({ message: 'User saved successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = router;