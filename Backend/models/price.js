const mongoose = require("mongoose");

// Define MongoDB Schema
const priceSchema = new mongoose.Schema({
    serviceType: {
        requied: true,
        type: String
    },
    price: {
        required: true,
        type: Number,
    },
});

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;