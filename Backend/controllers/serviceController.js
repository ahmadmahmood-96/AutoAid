const Price = require("../models/price");
const Service = require("../models/service");

exports.getPrice = async (req, res) => {
    try {
        const {
            serviceType
        } = req.params;
        const price = await Price.findOne({
            serviceType
        });
        if (price) {
            res.json({
                price
            });
        } else {
            res.status(404).json({
                error: "Price not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.bookService = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            name,
            vehicleType,
            serviceType,
            latitude,
            longitude,
            basePrice,
            status
        } = req.body;

        // Create a new service provider object
        const service = new Service({
            name,
            vehicleType,
            serviceType,
            coordinate: {
                latitude,
                longitude
            },
            basePrice,
            status
        });

        // Save the service provider to the database
        await service.save();

        // Send a success response
        res.status(201).json({
            message: "Service booked successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};