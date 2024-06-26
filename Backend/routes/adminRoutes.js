const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get('/total-vehicle-owners', adminController.getTotalVehicleOwners);
router.get('/total-service-providers', adminController.getTotalServiceProivders);
router.get('/total-workshop-owners', adminController.getTotalWorkshopOwners);
router.get('/total-products', adminController.getTotalProducts);
router.get('/total-orders', adminController.getTotalOrders);
router.get('/total-dispatched-orders', adminController.getTotalDispatchedOrders);
router.get('/total-delivered-orders', adminController.getTotalDeliveredOrders);
router.get('/get-orders', adminController.getOrders);
router.get('/total-users', adminController.getUsers);
router.delete('/delete-user/:userId', adminController.deleteUser);
router.put('/block-user/:userId', adminController.blockUser);
router.put('/unblock-user/:userId', adminController.unblockUser);
router.post('/save-service-type-prices', adminController.saveServiceTypePrice);
router.get('/get-service-types-prices', adminController.getServiceTypePrices);
router.delete('/delete-service-type-price/:productId', adminController.deleteServiceTypePrice);
router.put('/edit-service-type-price/:productId', adminController.editServiceTypePrice);

module.exports = router;