const express = require('express');
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.get('/prices/:serviceType', serviceController.getPrice);
router.post('/book-service', serviceController.bookService);

module.exports = router;