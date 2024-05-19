const mongoose = require("mongoose");

// Define MongoDB Schema
const workshopLocationSchema = new mongoose.Schema({
    workshopOwner: {
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

workshopLocationSchema.index({
    coordinates: '2dsphere'
});

const WorkshopLocation = mongoose.model("WorkshopLocation", workshopLocationSchema);

module.exports = WorkshopLocation;