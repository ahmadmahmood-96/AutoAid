const {
    VehicleOwner,
    WorkshopOwner,
    ServiceProvider
} = require("../models/user");
const Product = require('../models/product');

exports.getTotalVehicleOwners = async (req, res) => {
    try {
        const totalVehicleOwners = await VehicleOwner.countDocuments();
        res.json({
            totalVehicleOwners
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.getTotalWorkshopOwners = async (req, res) => {
    try {
        const totalWorkshopOwners = await WorkshopOwner.countDocuments();
        res.json({
            totalWorkshopOwners
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.getTotalServiceProivders = async (req, res) => {
    try {
        const totalServiceProviders = await ServiceProvider.countDocuments();
        res.json({
            totalServiceProviders
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.getTotalProducts = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.json({
            totalProducts
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};