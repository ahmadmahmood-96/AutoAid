const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify");
const productController = require('../controllers/productController');

router.post('/save-product', verifyToken, productController.uploadMiddleware, productController.saveProduct);
router.get('/get-products', verifyToken, productController.getAllProducts);

module.exports = router;