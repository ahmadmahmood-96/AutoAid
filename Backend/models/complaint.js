const mongoose = require('mongoose');

// Define the schema
const complaintSchema = new mongoose.Schema({
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    complaintText: {
        type: String,
        required: true,
        trim: true
    }
});

// Create the model
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;