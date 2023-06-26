const rateLimit = require('express-rate-limit');

// Rate limiting middleware to limit the number of requests from a single IP
function createRateLimiter(maxAttempts, windowInMinutes) {
    return rateLimit({
        windowMs: windowInMinutes * 60 * 1000, // convert minutes to milliseconds
        max: maxAttempts,
        message: `Too many requests from this IP, please try again after ${windowInMinutes} minutes.`
    });
}

module.exports = createRateLimiter;