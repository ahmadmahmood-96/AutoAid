const express = require('express');
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post('/intents', paymentController.intents);

module.exports = router;