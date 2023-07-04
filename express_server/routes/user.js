const express = require('express');
const { validateToken } = require('../middleware/JWT');
const createRateLimiter = require('../middleware/rateLimiter');
const userController = require('../controllers/userController');
const router = express.Router();

// Create a rate limiter for 100 requests per 15 minutes
limiter = createRateLimiter(100, 15);

// Subscribe route
router.post("/subscribe", limiter, validateToken, userController.subscribeUser);

// Password reset route
router.post("/reset-password", limiter, validateToken, userController.resetPassword);

// Email reset route
router.post("/reset-email", limiter, validateToken, userController.resetEmail);

// Complaint registration route
router.post("/register-complaint", validateToken, userController.registerComplaint)

//Subscription history route
router.post("/plans-history",validateToken,userController.plansHistory);
module.exports = router;