const mongoose = require('mongoose');

// Define the Slot schema
const slotSchema = new mongoose.Schema({
    workshopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: String, // Using String to store the date in 'MM/DD/YYYY' format
        required: true
    },
    time: {
        type: String, // Using String to store the time in 'HH:MM:SS AM/PM' format
        required: true
    }
});

// Create the Slot model
const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;