const express = require('express');
const createRateLimiter = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const router = express.Router();

// Create a rate limiter for 10 requests per 15 minutes
limiter = createRateLimiter(10, 15);

// Login route
router.post("/login", limiter, authController.login);

// Signup route
router.post("/sign-up", limiter, authController.signUp);

module.exports = router;