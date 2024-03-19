const userModel = require("../models/user");
const {
    VehicleOwner,
    WorkshopOwner,
    ServiceProvider
} = require("../models/user");
const Product = require('../models/product');
const Order = require('../models/order');

exports.getTotalVehicleOwners = async (req, res) => {
    try {
        const totalVehicleOwners = await VehicleOwner.countDocuments();
        res.json({
            totalVehicleOwners
        });
    } catch (error) {
        res.json({
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
        res.json({
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
        res.json({
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
        res.json({
            error: 'Internal Server Error'
        });
    }
};

exports.getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({
            totalOrders
        });
    } catch (error) {
        res.json({
            error: 'Internal Server Error'
        });
    }
};

exports.getTotalDispatchedOrders = async (req, res) => {
    try {
        const totalDispatchedOrders = await Order.countDocuments({
            status: 'Order Dispatched'
        });
        res.json({
            totalDispatchedOrders
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.getTotalDeliveredOrders = async (req, res) => {
    try {
        const totalDeliveredOrders = await Order.countDocuments({
            status: 'Order Delivered'
        });
        res.json({
            totalDeliveredOrders
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.json({
            error: 'Internal Server Error'
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.User.find({
            __t: {
                $ne: "Admin"
            }
        });
        res.json(users);
    } catch (error) {
        res.json({
            error: 'Internal Server Error'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const {
            userId
        } = req.params;

        const user = await userModel.User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                error: 'User not found'
            });
        }
        // Perform deletion in the database
        await userModel.User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const {
            userId
        } = req.params;
        const user = await userModel.User.findByIdAndUpdate(userId, {
            isBlocked: true
        }, {
            new: true
        });

        if (user) {
            return res.json({
                success: true,
                message: 'User blocked successfully'
            });
        } else {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const {
            userId
        } = req.params;
        const user = await userModel.User.findByIdAndUpdate(userId, {
            isBlocked: false
        }, {
            new: true
        });

        if (user) {
            return res.json({
                success: true,
                message: 'User unblocked successfully'
            });
        } else {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};