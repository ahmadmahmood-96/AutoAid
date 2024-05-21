const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    images: [{
        data: {
            type: String,
            required: true,
        },
    }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;