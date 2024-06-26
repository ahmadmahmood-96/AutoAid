const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const {
//     sendVerificationEmail
// } = require("../utils/sendVerificationEmail");
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Import your user models
const userModel = require("../models/user");
const {
    VehicleOwner,
    WorkshopOwner,
    ServiceProvider
} = require("../models/user");
const {
    sendVerificationEmail
} = require("../utils/sendVerificationEmail");

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
        let user;

        if (selectedRole === 'vehicleOwner') {
            user = new VehicleOwner({
                name,
                email,
                phoneNumber: number,
                password,
                isBlocked: false,
                vehicleType,
            });
        } else if (selectedRole === 'workshopOwner') {
            user = new WorkshopOwner({
                name,
                email,
                phoneNumber: number,
                password,
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
            return res.status(400).json({
                message: 'User does not exist'
            });
        }

        if (user.isBlocked) {
            return res.status(400).json({
                message: 'You are blocked.'
            });
        }

        // Check if the password matches (You should use a proper password hashing library for security)
        if (user.password !== password) {
            return res.status(400).json({
                message: 'Wrong Password'
            });
        }

        // Common logic for both cases
        return generateAndSendToken(res, user, user.__t);
    }
};

exports.chat = async (req, res) => {
    try {
        const {
            userInput
        } = req.body;

        const response = await openai.chat.create({
            messages: [{
                    role: "user",
                    content: userInput,
                },
                {
                    role: "system",
                    content: "Welcome! I'm the Autoaid chatbot, here to assist you on your journey by providing guidance and solutions to issues related to your car. Whether it's troubleshooting problems, offering maintenance tips, or providing advice on road safety, I'm here to help you navigate smoothly through any challenges you encounter on the road.",
                },
            ],
            model: "gpt-3.5-turbo",
        });

        res.json({
            response: response.data.choices[0].message
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};