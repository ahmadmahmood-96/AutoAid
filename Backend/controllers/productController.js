const Product = require('../models/product');
const multer = require('multer');

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/'); // Define the directory for storing uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname); // Generate unique filenames
    },
});
const upload = multer({
    storage: storage
});

// Save product information
exports.saveProduct = async (req, res) => {
    try {
        const {
            productName,
            price,
            quantity,
            description,
        } = req.body;

        // Get array of image filenames from uploaded files
        const filenames = req.files.map(file => file.filename);

        // Create a new product instance
        const product = new Product({
            productName,
            price,
            quantity,
            description,
            images: filenames.map(filename => ({
                filename
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

// Multer middleware for file uploads
exports.uploadMiddleware = upload.array('images');

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