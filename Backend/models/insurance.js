const mongoose = require('mongoose');

// Define the schema
const insuranceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverage: {
        type: [String],
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// Create a model based on the schema
const Insurance = mongoose.model('Insurance', insuranceSchema);

module.exports = Insurance;