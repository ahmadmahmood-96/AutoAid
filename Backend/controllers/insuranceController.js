const Insurance = require('../models/insurance');
const {
    VehicleOwner
} = require('../models/user');


// Save insurance information
exports.saveInsurance = async (req, res) => {
    try {
        const {
            name,
            description,
            coverage,
            duration,
            price
        } = req.body;

        const insurance = new Insurance({
            name,
            description,
            coverage,
            duration,
            price
        });

        // Save the insurance to the database
        await insurance.save();

        res.status(201).json({
            message: 'Insurance saved successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

exports.getAllInsurances = async (req, res) => {
    try {
        const insurances = await Insurance.find();
        res.json(insurances);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

exports.deleteInsurance = async (req, res) => {
    try {
        const {
            insuranceId
        } = req.params;

        const insurance = await Insurance.findById(insuranceId);

        if (!insurance) {
            return res.status(404).json({
                success: false,
                error: 'Insurance not found'
            });
        }
        // Perform deletion in the database
        await Insurance.findByIdAndDelete(insuranceId);

        res.json({
            success: true,
            message: 'Insurance deleted successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

exports.editInsurance = async (req, res) => {
    try {
        const insuranceId = req.params.insuranceId;
        const updatedInsuranceData = req.body;
        const updatedInsurance = await Insurance.findByIdAndUpdate(
            insuranceId, {
                $set: updatedInsuranceData
            }, {
                new: true
            }
        );
        if (!updatedInsurance) {
            res.json({
                message: 'Insurance not found'
            });
        } else res.status(201).json({
            message: 'Insurance updated successfully'
        });
    } catch (error) {
        res.json({
            error: 'Error updating insurance'
        });
    }
};

exports.boughtInsurance = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            userId,
            insuranceId
        } = req.body;

        // Find the user by ID
        const user = await VehicleOwner.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update the user's insurance information
        user.haveInsurance = true;
        user.insurance.id = insuranceId;
        user.insurance.bought = Date.now();
        user.insurance.isRenewed = false;

        // Save the updated user
        await user.save();

        // Send a success response
        res.status(200).json({
            message: "Insurance saved successfully"
        });
    } catch (error) {
        // Send an error response
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getInsurance = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by their ID and populate the insurance field
        const user = await VehicleOwner.findById(userId).populate("insurance.id");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (!user.insurance) {
            return res.status(200).json({
                message: "User does not have insurance."
            });
        }

        res.status(200).json({
            insurance: user.insurance
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error."
        });
    }
};

exports.checkInsurance = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await VehicleOwner.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const haveInsurance = user.haveInsurance;
        res.status(200).json({
            haveInsurance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

exports.cancelInsurance = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user exists and is a vehicle owner
        const user = await VehicleOwner.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found or not a vehicle owner'
            });
        }

        // Check if the user has insurance
        if (!user.haveInsurance) {
            return res.status(400).json({
                message: 'User does not have insurance'
            });
        }

        // Update user's insurance details
        user.haveInsurance = false;
        user.insurance.id = null; // Remove insurance details
        user.insurance.bought = null;

        await user.save();

        res.status(200).json({
            message: 'Insurance cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling insurance:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};