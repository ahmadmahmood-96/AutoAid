const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    products: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            require: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    }, ],
    shippingAddress: {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        houseNo: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        town: {
            type: String
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Order Placed'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;