const express = require('express');
const router = express.Router();
const workshopController = require("../controllers/workshopController");

router.post('/update-location/:userId', workshopController.updateLocation);
router.get('/nearby', workshopController.getNearbyWorkshops);
router.post('/save-slot', workshopController.saveSlot);
router.get('/get-slots/:ownerId', workshopController.getSlots);
router.delete('/remove-slot/:id', workshopController.removeSlot);
router.post('/book-appointment', workshopController.bookAppointment);
router.get('/get-appointment/:id', workshopController.getUserAppointment);
router.get('/get-appointment-workshop/:id', workshopController.getWorkshopAppointment);
router.delete('/delete-appointment/:id', workshopController.deleteAppointment);

module.exports = router;