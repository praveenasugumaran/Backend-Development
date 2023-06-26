const User = require('../models/user');
const Subscription = require('../models/subscription');
const bcrypt = require('bcrypt');

// This function handles a request to subscribe a user
exports.subscribeUser = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            const existingSubscription = await Subscription.findOne({ user: userExists._id });
            if (existingSubscription) {
                return res.status(400).json({ message: 'Already subscribed' });
            } else {
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
};

// This function handles a request to reset a user's password
exports.resetPassword = async (req, res) => {
    if (!req.body.newPassword) {
        return res.status(400).json({ message: 'New password is required' });
    }
    try {
        const user = req.user;
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

// This function handles a request to reset a user's email
exports.resetEmail = async (req, res) => {
    if (!req.body.newEmail) {
        return res.status(400).json({ message: 'New Email is required' });
    }
    const newEmail = req.body.newEmail;
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    try {
        const user = req.user;
        user.email = newEmail;
        await user.save();
        return res.status(200).json({ message: 'Email successfully reset' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'An error occurred' });
    }
};