const {
    WorkshopOwner
} = require("../models/user");
const WorkshopLocation = require("../models/workshopLocation");
const Slot = require("../models/slot");
const Appointment = require("../models/appointment");

exports.updateLocation = async (req, res) => {
    const {
        userId
    } = req.params; // Extract userId from request params
    const {
        latitude,
        longitude
    } = req.body;

    try {
        // Find the workshop owner by user ID
        const workshopOwner = await WorkshopOwner.findById(userId);

        if (!workshopOwner) {
            return res.status(404).json({
                message: 'Workshop owner not found'
            });
        }

        // Create or update WorkshopLocation document
        let workshopLocation = await WorkshopLocation.findOne({
            serviceProvider: userId
        });

        if (!workshopLocation) {
            // If WorkshopLocation doesn't exist, create a new one
            workshopLocation = new WorkshopLocation({
                serviceProvider: userId,
                coordinates: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            });
        } else {
            // If WorkshopLocation exists, update coordinates
            workshopLocation.coordinates = {
                type: "Point",
                coordinates: [longitude, latitude]
            };
        }

        // Save WorkshopLocation document
        await workshopLocation.save();

        // Respond with the updated workshop owner document
        return res.status(200).json({
            message: 'Location Updated successfully'
        });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

exports.getNearbyWorkshops = async (req, res) => {
    try {
        // Get latitude and longitude from request query parameters
        const {
            latitude,
            longitude
        } = req.query;

        // Query nearby workshops within a certain radius (e.g., 10 kilometers)
        const maxDistance = 7000;
        const nearbyWorkshops = await WorkshopLocation.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            parseFloat(longitude),
                            parseFloat(latitude)
                        ] // Convert string coordinates to float
                    },
                    $maxDistance: maxDistance // Max distance in meters
                }
            }
        });
        // Create an array to store the promises of fetching WorkshopOwner details
        const workshopsWithOwnerDetails = await Promise.all(
            nearbyWorkshops.map(async (workshop) => {
                // Fetch WorkshopOwner details for each workshop
                const owner = await WorkshopOwner.findById(
                    workshop.workshopOwner
                );
                // Return the combined details of workshop and owner
                return {
                    workshop,
                    owner
                };
            })
        );

        // Respond with the array of workshops along with their owner details
        res.json(workshopsWithOwnerDetails);
    } catch (error) {
        console.error("Error fetching nearby workshops:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

exports.saveSlot = async (req, res) => {
    try {
        const slotData = req.body;
        const newSlot = new Slot(slotData);
        await newSlot.save();
        res.status(201).json({
            message: 'Slot created successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to create slot'
        });
    }
};

exports.getSlots = async (req, res) => {
    try {
        const {
            ownerId
        } = req.params; // Extract owner ID from request params
        // Find the workshop owner by ID
        const workshopOwner = await WorkshopOwner.findById(ownerId);

        if (!workshopOwner) {
            return res.status(404).json({
                message: 'Workshop owner not found'
            });
        }

        // Fetch slots associated with the workshop owner
        const ownerSlots = await Slot.find({
            workshopId: ownerId
        });

        res.json({
            slots: ownerSlots
        });
    } catch (error) {
        console.error('Error fetching slots by owner:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

exports.removeSlot = async (req, res) => {
    const slotId = req.params.id;

    try {
        // Find the slot by ID and remove it from the database
        const removedSlot = await Slot.findByIdAndDelete(slotId);

        if (!removedSlot) {
            return res.status(404).json({
                error: 'Slot not found'
            });
        }

        res.json({
            message: 'Slot removed successfully',
            slot: removedSlot
        });
    } catch (error) {
        console.error('Error removing slot:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const {
            userId,
            name,
            phoneNumber,
            date,
            time,
            workshopId
        } = req.body;

        // Create a new appointment
        const appointment = new Appointment({
            userId,
            name,
            phoneNumber,
            workshopId,
            date,
            time,
        });

        await appointment.save();

        res.status(201).json({
            message: 'Appointment booked successfully',
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

exports.getUserAppointment = async (req, res) => {
    try {
        const userId = req.params.id;

        const appointments = await Appointment.findOne({
            userId
        });
        console.log(appointments)
        if (!appointments) {
            return res.status(201).json({
                message: 'No appointments found for this user'
            });
        }

        res.status(200).json({
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

exports.getWorkshopAppointment = async (req, res) => {
    try {
        const workshopId = req.params.id;

        const appointments = await Appointment.find({
            workshopId
        });

        if (!appointments) {
            return res.status(201).json({
                message: 'No appointments found for this user'
            });
        }

        res.status(200).json({
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

exports.deleteAppointment = async (req, res) => {
    const appointmentId = req.params.id;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

        if (!deletedAppointment) {
            return res.status(404).json({
                message: 'Appointment not found'
            });
        }

        res.json({
            message: 'Appointment deleted successfully',
            appointment: deletedAppointment
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};