const mongoose = require('mongoose');

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

// Create User Model from the Schema
const User = mongoose.model("User", userSchema);

module.exports = User;