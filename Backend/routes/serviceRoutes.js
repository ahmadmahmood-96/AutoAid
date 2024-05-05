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


module.exports = router;