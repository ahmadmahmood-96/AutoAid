const express = require('express');
const router = express.Router();
const mileageController = require('../controllers/mileageController');

router.post('/save-mileage', mileageController.saveMileage);

module.exports = router;