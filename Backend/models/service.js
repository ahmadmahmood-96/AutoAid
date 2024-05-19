const mongoose = require("mongoose");

// Define MongoDB Schema
const serviceSchema = new mongoose.Schema({
    vehicleOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
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
        },
    },
    basePrice: {
        required: true,
        type: Number,
    },
    nearByServiceProvider: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        latitude: {
            required: true,
            type: Number
        },
        longitude: {
            required: true,
            type: Number
        },
    },
    status: {
        default: 'Pending',
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;