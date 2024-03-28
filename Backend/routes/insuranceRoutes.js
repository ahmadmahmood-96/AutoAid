const express = require('express');
const router = express.Router();
const insuranceController = require("../controllers/insuranceController");

router.post('/save-insurance', insuranceController.saveInsurance);
router.get('/get-insurances', insuranceController.getAllInsurances);
router.delete('/delete-insurance/:insuranceId', insuranceController.deleteInsurance);
router.put('/edit-insurance/:insuranceId', insuranceController.editInsurance);

module.exports = router;