const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify");
const productController = require('../controllers/productController');

router.post('/save-product', productController.saveProduct);
router.get('/get-products', productController.getAllProducts);
router.delete('/delete-product/:productId', productController.deleteProduct);
router.put('/edit-product/:productId', productController.editProduct);

module.exports = router;