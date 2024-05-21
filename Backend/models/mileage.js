const mongoose = require("mongoose");

const mileageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    currentMileage: {
        type: Number,
        required: true,
    },
    targetMileage: {
        type: Number,
        required: true,
    },
});

const Mileage = mongoose.model('Mileage', mileageSchema);

module.exports = Mileage;