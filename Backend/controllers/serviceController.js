const Price = require("../models/price");
const Service = require("../models/service");
const ServiceProvidersLocation = require("../models/serviceProvidersLocation");

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
            coordinate,
            basePrice,
            nearByServiceProvider,
            status
        } = req.body;

        // Create a new service object
        const service = new Service({
            name,
            vehicleType,
            serviceType,
            coordinate,
            basePrice,
            nearByServiceProvider,
            status
        });

        // Save the service to the database
        await service.save();

        // Send a success response
        res.status(201).json({
            message: "Service booked successfully"
        });
    } catch (error) {
        console.error("Error booking service:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

// Endpoint to fetch service requests based on service provider ID
exports.getServiceRequests = async (req, res) => {
    try {
        const {
            serviceProviderId
        } = req.query;

        // Find service requests where nearByServiceProvider ID matches the provided serviceProviderId
        const serviceRequests = await Service.find({
            "nearByServiceProvider.id": serviceProviderId,
            status: "Pending"
        });

        res.json(serviceRequests);
    } catch (error) {
        console.error("Error fetching service requests:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};


// Update service provider's location
exports.updateLocation = async (req, res) => {
    const {
        serviceProviderId,
        latitude,
        longitude
    } = req.body;

    try {
        let serviceProvider = await ServiceProvidersLocation.findOne({
            serviceProvider: serviceProviderId // Assuming serviceProviderId is the correct identifier
        });
        if (!serviceProvider) {
            serviceProvider = new ServiceProvidersLocation({
                serviceProvider: serviceProviderId, // Correcting to use serviceProvider
                coordinates: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
            });
        } else {
            serviceProvider.coordinates = {
                type: "Point",
                coordinates: [longitude, latitude],
            };
        }

        await serviceProvider.save();

        res.status(200).json({
            message: 'Location updated successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

exports.getServiceProvidersLocation = async (req, res) => {
    try {
        const {
            latitude,
            longitude
        } = req.query; // Assuming latitude and longitude are passed as query parameters
        const maxDistance = 7000; // Maximum distance in meters (7KM)
        // Perform a geospatial query to find service providers within the specified radius
        const serviceProviders = await ServiceProvidersLocation.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)] // Convert string coordinates to float
                    },
                    $maxDistance: maxDistance // Max distance in meters
                }
            }
        });

        res.status(200).json({
            serviceProviders
        });
    } catch (error) {
        console.error("Error fetching service provider locations:", error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

// Backend: Modify the controller to handle declining a service request
exports.declineServiceRequest = async (req, res) => {
    const {
        requestId
    } = req.params;

    try {
        // Find the service request by ID
        const serviceRequest = await Service.findById(requestId);

        if (!serviceRequest) {
            return res.status(404).json({
                error: "Service request not found"
            });
        }

        // Update the status of the service request to "Declined"
        serviceRequest.status = "Declined";
        await serviceRequest.save();

        // Find nearby service providers again
        const {
            latitude,
            longitude
        } = serviceRequest.coordinate;
        const nearbyServiceProviders = await ServiceProvidersLocation.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                },
            },
        }).limit(5); // Limit to 5 nearby service providers
        const randomIndex = Math.floor(Math.random() * nearbyServiceProviders.length);
        // Assign a new service provider to the request
        if (nearbyServiceProviders.length > 0) {
            const newServiceProvider = nearbyServiceProviders[randomIndex];
            serviceRequest.nearByServiceProvider.id = newServiceProvider.serviceProvider;
            serviceRequest.nearByServiceProvider.latitude = newServiceProvider.coordinates.coordinates[1];
            serviceRequest.nearByServiceProvider.longitude = newServiceProvider.coordinates.coordinates[0];
            serviceRequest.status = "Pending"; // Reset status
            await serviceRequest.save();
        }

        res.status(200).json({
            message: "Service request declined successfully"
        });
    } catch (error) {
        console.error("Error declining service request:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

// serviceController.js
exports.acceptServiceRequest = async (req, res) => {
    try {
        const {
            requestId
        } = req.params;
        // Update the status of the service request to 'Accepted'
        await Service.findByIdAndUpdate(requestId, {
            status: 'Accepted'
        });
        res.status(200).json({
            message: 'Service request accepted successfully'
        });
    } catch (error) {
        console.error('Error accepting service request:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Controller function to fetch details of a service request
exports.getServiceRequestDetails = async (req, res) => {
    try {
        const {
            requestId
        } = req.params;
        // Find the service request by ID
        const serviceRequest = await Service.findById(requestId);
        if (!serviceRequest) {
            return res.status(404).json({
                error: 'Service request not found'
            });
        }
        // Extract necessary details from the service request and send as response
        const {
            coordinate,
            nearByServiceProvider
        } = serviceRequest;
        const userLocation = {
            latitude: coordinate.latitude,
            longitude: coordinate.longitude
        };
        const serviceProviderLocation = {
            latitude: nearByServiceProvider.latitude,
            longitude: nearByServiceProvider.longitude
        };
        res.status(200).json({
            userLocation,
            serviceProviderLocation
        });
    } catch (error) {
        console.error('Error fetching service request details:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};