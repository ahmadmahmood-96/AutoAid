const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get('/total-vehicle-owners', adminController.getTotalVehicleOwners);
router.get('/total-service-providers', adminController.getTotalServiceProivders);
router.get('/total-workshop-owners', adminController.getTotalWorkshopOwners);
router.get('/total-products', adminController.getTotalProducts);

module.exports = router;