const mongoose = require("mongoose");

// Define MongoDB Schema
const serviceSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    vehicleType: {
        requied: true,
        type: String
    },
    serviceType: {
        requied: true,
        type: String
    },
    coordinate: {
        latitude: {
            required: true,
            type: Number
        },
        longitude: {
            required: true,
            type: Number
        }
    },
    basePrice: {
        required: true,
        type: Number,
    },
    status: {
        default: 'Pending',
        type: String
    }
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;