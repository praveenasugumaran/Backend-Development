require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { createToken, validateToken } = require('./JWT');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Middleware
app.use(helmet()); // Security middleware to protect against various vulnerabilities
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// Rate limiting middleware to limit the number of requests from a single IP
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Define Subscription Schema
const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

// Create User Model from the Schema
const User = mongoose.model("User", userSchema);

// Create Subscription Model from the SubSchema
const Subscription = mongoose.model("Subscription", subscriptionSchema);

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

// Login route
app.post("/login", async (req, res) => {
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

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

// Signup route
app.post("/sign-up", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    // Try to create a new user
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
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

// Subscribe route
app.post("/subscribe", validateToken, async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            // If a subscription already exists.
            const existingSubscription = await Subscription.findOne({ user: userExists._id });

            if (existingSubscription) {
                return res.status(400).json({ message: 'Already subscribed' });
            } else {
                // If no subscription exists, it creates a new subscription for the user and saves it to the database.
                const newSubscription = new Subscription({
                    user: userExists._id
                });
                await newSubscription.save();
                return res.status(200).json({ message: 'User successfully subscribed' });
            }
        } else {
            return res.status(400).json({ message: 'User does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Successfully listening on port ${port}...`);
});
