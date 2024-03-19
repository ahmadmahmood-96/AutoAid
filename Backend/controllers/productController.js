const Product = require('../models/product');
const Order = require('../models/order');

// Save product information
exports.saveProduct = async (req, res) => {
    try {
        const {
            productName,
            price,
            quantity,
            description,
            category,
            images // array of objects with filename and data properties
        } = req.body;

        const product = new Product({
            productName,
            price,
            quantity,
            description,
            category,
            images: images.map(base64String => ({
                data: base64String
            })),
        });

        // Save the product to the database
        await product.save();

        res.status(201).json({
            message: 'Product saved successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const {
            productId
        } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        // Perform deletion in the database
        await Product.findByIdAndDelete(productId);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProductData = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, {
                $set: updatedProductData
            }, {
                new: true
            }
        );
        if (!updatedProduct) {
            res.json({
                message: 'Product not found'
            });
        } else res.status(201).json({
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.json({
            error: 'Error updating product'
        });
    }
};

// Save product information
exports.placeOrder = async (req, res) => {
    try {
        const {
            user,
            products,
            shippingAddress,
            totalPrice,
            paymentMethod,
        } = req.body;

        // Check product availability and quantity
        for (const productItem of products) {
            const product = await Product.findById(productItem.productId);
            if (!product) {
                return res.status(400).json({
                    message: 'Product not found'
                });
            }
            if (productItem.quantity > product.quantity) {
                return res.status(400).json({
                    message: `Not enough stock available for ${product.productName}`
                });
            }
        }

        // Create a new order instance
        const order = new Order({
            user,
            products,
            shippingAddress,
            totalPrice,
            paymentMethod,
        });

        // Save the order to the database
        await order.save();

        // Update product quantities in the database
        for (const productItem of products) {
            const product = await Product.findById(productItem.productId);
            product.quantity -= productItem.quantity;
            await product.save();
        }

        // Respond with success message
        res.status(201).json({
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};