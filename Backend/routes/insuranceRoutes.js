const express = require('express');
const router = express.Router();
const insuranceController = require("../controllers/insuranceController");

router.post('/save-insurance', insuranceController.saveInsurance);
router.get('/get-insurances', insuranceController.getAllInsurances);
router.delete('/delete-insurance/:insuranceId', insuranceController.deleteInsurance);
router.put('/edit-insurance/:insuranceId', insuranceController.editInsurance);
router.post('/bought-insurance', insuranceController.boughtInsurance);
router.get('/check-insurance/:userId', insuranceController.checkInsurance);
router.get('/get-insurance/:userId', insuranceController.getInsurance);
router.delete('/cancel-insurance/:userId', insuranceController.cancelInsurance);

module.exports = router;