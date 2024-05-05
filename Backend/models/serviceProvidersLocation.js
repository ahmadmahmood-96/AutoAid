const mongoose = require("mongoose");

// Define MongoDB Schema
const serviceProviderLocationSchema = new mongoose.Schema({
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    coordinates: {
        type: {
            type: String
        },
        coordinates: [Number], // [longitude, latitude]
    },
});

serviceProviderLocationSchema.index({
    coordinates: '2dsphere'
});

const ServiceProvidersLocation = mongoose.model("ServiceProvidersLocation", serviceProviderLocationSchema);

module.exports = ServiceProvidersLocation;