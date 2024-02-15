const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
    sendVerificationEmail
} = require("../utils/sendVerificationEmail");

// Import your user models
const userModel = require("../models/user");
const {
    VehicleOwner,
    WorkshopOwner,
    ServiceProvider
} = require("../models/user");

exports.registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            number,
            password,
            selectedRole,
            vehicleType,
            workshopName,
            workshopAddress,
            licenseNumber,
        } = req.body;
        const otp = crypto.randomInt(100000, 1000000);
        let user;

        if (selectedRole === 'vehicleOwner') {
            user = new VehicleOwner({
                name,
                email,
                phoneNumber: number,
                password,
                otp,
                isVerified: false,
                isBlocked: false,
                vehicleType,
            });
        } else if (selectedRole === 'workshopOwner') {
            user = new WorkshopOwner({
                name,
                email,
                phoneNumber: number,
                password,
                otp,
                isVerified: false,
                isBlocked: false,
                workshopName,
                workshopAddress,
            });
        } else if (selectedRole === 'serviceProvider') {
            user = new ServiceProvider({
                name,
                email,
                phoneNumber: number,
                password,
                otp,
                isVerified: false,
                isBlocked: false,
                licenseNumber,
            });
        } else {
            return res.status(400).json({
                message: 'Invalid user role'
            });
        }

        // Save the user to the database
        await user.save();
        sendVerificationEmail(email, otp);

        // Handle the response as needed (e.g., show success message)
        res.status(200).json({
            message: 'User data saved successfully'
        });
    } catch (error) {
        // Handle errors
        res.json({
            error: 'An error occurred while processing the request'
        });
    }
}

exports.verifyEmail = async (req, res) => {
    const {
        email
    } = req.body;
    const user = await userModel.User.findOne({
        email
    });

    if (!user) {
        return res.json({
            message: 'User does not exist'
        });
    }

    if (!user.isVerified) {
        return res.json({
            message: 'Email not Verified'
        });
    }

    const otp = crypto.randomInt(100000, 1000000);
    await sendVerificationEmail(email, otp);
    return res.status(201).json({
        otp: otp,
        message: 'OTP sent to your email'
    });
};

exports.changePassword = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    const user = await userModel.User.findOne({
        email
    });

    // Check if user exists
    if (!user) {
        return res.json({
            message: 'User not found.'
        });
    }

    if (user.isBlocked) {
        return res.json({
            message: 'You are blocked.'
        });
    }

    user.password = password;
    await user.save();

    return res.status(201).json({
        message: 'Password is updated'
    });
};

exports.verifyOTP = async (req, res) => {
    try {
        const {
            email,
            otpNumber
        } = req.body;

        // Query the database for the user's OTP
        const user = await userModel.User.findOne({
            email
        });

        if (!user) {
            return res.send('User not found.');
        }

        user.isVerified = true;
        // Check if the OTP matches
        if (user.otp == otpNumber) {
            await userModel.User.updateOne({
                email
            }, {
                $unset: {
                    otp: 1
                }
            });
            res.status(200).json({
                message: 'Account verified successfully!'
            });
        } else {
            res.json({
                message: 'Invalid OTP. Please try again.'
            });
        }
    } catch (error) {
        res.send('An error occurred during verification.');
    }
};

const generateAndSendToken = (res, user, role) => {
    const token = jwt.sign({
        user: user
    }, process.env.SECRET_KEY);

    // Successful login
    return res.status(200).json({
        message: `${role} Login Successful`,
        role: user.__t,
        token: token,
    });
};

exports.loginUser = async (req, res) => {
    const origin = req.get('Origin');
    const {
        email,
        password
    } = req.body;

    if (origin === "http://localhost:3000" || origin === `${process.env.BASE_URL}`) {
        // Handle login for Admin
        const user = await userModel.User.findOne({
            email,
            __t: "Admin"
        });

        if (!user) {
            return res.json({
                message: 'Admin does not exist'
            });
        }

        // Check if the password matches (You should use a proper password hashing library for security)
        if (user.password !== password) {
            return res.json({
                message: 'Invalid Password'
            });
        }

        // Common logic for both cases
        return generateAndSendToken(res, user, "Admin");
    } else {
        // Handle login for other users (non-Admin)
        const user = await userModel.User.findOne({
            email,
            __t: {
                $ne: "Admin"
            } // Use $ne (not equal) to find users other than Admin
        });


        if (!user) {
            return res.json({
                message: 'User does not exist'
            });
        }

        if (user.isBlocked) {
            return res.json({
                message: 'You are blocked.'
            });
        }

        // Check if the password matches (You should use a proper password hashing library for security)
        if (user.password !== password) {
            return res.json({
                message: 'Invalid Password'
            });
        }

        // Common logic for both cases
        return generateAndSendToken(res, user, user.__t);
    }
};