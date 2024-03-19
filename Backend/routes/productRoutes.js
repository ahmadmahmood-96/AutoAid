const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/save-product', productController.saveProduct);
router.get('/get-products', productController.getAllProducts);
router.delete('/delete-product/:productId', productController.deleteProduct);
router.put('/edit-product/:productId', productController.editProduct);
router.post('/place-order', productController.placeOrder);

module.exports = router;