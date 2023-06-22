require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { createToken } = require('./JWT');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Middleware
app.use(helmet()); // Security middleware
app.use(cors()); // Handling CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ // Rate limiting
    windowMs: 15 * 60 * 1000,
    max: 100
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

// Create User Model
const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post("/", async (req, res) => {
    // Input validation (example)
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, userExists.password);
            if (isPasswordMatch) {
                const accessToken = createToken(userExists, process.env.SECRET_KEY);
                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
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

app.post("/signup", async (req, res) => {
    // Input validation (example)
    if (!req.body.username || !req.body.emailid || !req.body.password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                email: req.body.emailid,
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Successfully listening on port ${port}...`);
});
