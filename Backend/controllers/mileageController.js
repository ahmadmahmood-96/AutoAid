const Mileage = require('../models/mileage');

exports.saveMileage = async (req, res) => {
    try {
        const {
            userId,
            currentMileage,
            targetMileage
        } = req.body;

        const mileage = new Mileage({
            userId,
            currentMileage,
            targetMileage
        });
        await mileage.save();

        res.status(200).json({
            message: 'Mileage saved successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};