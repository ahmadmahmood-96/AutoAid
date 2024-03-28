const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String
    },
    otp: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
    },
    isBlocked: {
        type: Boolean,
    }
});

// Base User model
const User = mongoose.models.Users || mongoose.model('Users', userSchema);

// Schema for a Vehicle Owner
const vehicleOwnerSchema = new mongoose.Schema({
    vehicleType: {
        type: String,
    },
    haveInsurance: {
        type: Boolean,
    },
    insurance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Insurance",
    }
});

// Schema for Workshop Owner
const workshopOwnerSchema = new mongoose.Schema({
    workshopName: {
        type: String,
    },
    workshopAddress: {
        type: String,
    },
});

// Schema for Service Provider
const serviceProviderSchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
    },
});

// Create discriminators
const VehicleOwner = User.discriminator('VehicleOwner', vehicleOwnerSchema);
const WorkshopOwner = User.discriminator('WorkshopOwner', workshopOwnerSchema);
const ServiceProvider = User.discriminator('ServiceProvider', serviceProviderSchema);

module.exports = {
    User,
    VehicleOwner,
    WorkshopOwner,
    ServiceProvider,
};