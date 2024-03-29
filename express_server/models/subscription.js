const mongoose = require('mongoose');

// Define Subscription Schema
const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    plans: [{
        amount: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        ExpireDate: Date
    }]
});

// Create Subscription Model from the SubSchema
const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;