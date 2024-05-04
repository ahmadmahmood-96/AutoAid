const mongoose = require("mongoose");

// Define MongoDB Schema
const serviceProviderLocationSchema = new mongoose.Schema({
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    coordinate: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    socketId: {
        type: String,
        required: true
    }
});

const ServiceProvidersLocation = mongoose.model("Service Providers Location", serviceProviderLocationSchema);

module.exports = ServiceProvidersLocation;