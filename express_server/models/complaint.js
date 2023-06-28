const mongoose = require('mongoose');

// Define Complaint Schema
const userComplaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    complaints: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        closedStatus: Boolean
    }]
});

// Create Complaint Model from the schema
const userComplaints = mongoose.model("Complaints", userComplaintSchema);

module.exports = userComplaints;