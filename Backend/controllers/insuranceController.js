const Insurance = require('../models/insurance');

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