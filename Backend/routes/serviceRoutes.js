const express = require('express');
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.get('/get-price/:serviceType', serviceController.getPrice);
router.post('/book-service', serviceController.bookService);
router.put('/updateLocation', serviceController.updateLocation);
router.get('/providers-locations', serviceController.getServiceProvidersLocation);
router.get('/requests', serviceController.getServiceRequests);
router.put('/requests/:requestId/decline', serviceController.declineServiceRequest);
router.put('/requests/:requestId/accept', serviceController.acceptServiceRequest);
router.get('/requests/:requestId', serviceController.getServiceRequestDetails);
router.get('/requests-by-vehicle-owner/:requestId', serviceController.getServiceRequestDetailsByVehicleOwner);
router.put('/requests/:id', serviceController.updateServiceRequest);
router.post('/cancel-request/:requestId', serviceController.cancelServiceRequest);
router.get('/requests/status/:requestId', serviceController.getServiceRequestStatus);
router.post('/submit-complaint/:requestId', serviceController.submitComplaint);

module.exports = router;