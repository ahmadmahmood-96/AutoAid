require('dotenv').config()
const express = require("express");
const app = express();
const port = 8080;
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
mongoose.set("strictQuery", false);

// Import your user models
const userModel = require('./models/user');
const {
    VehicleOwner,
    WorkshopOwner,
    ServiceProvider
} = require('./models/user');


// Middleware
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Database Setup
const URI = 'mongodb://127.0.0.1/AutoAid';
mongoose
    .connect(URI)
    .then((res) => {
        console.log('MongoDB Connected');
    })
    .catch((error) => {
        console.log('Error occurred');
    });

const sendVerificationEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'ahmadmahmoodxx@gmail.com',
            pass: 'kjva sqoi lvbl kapw'
        }
    });

    // Setup email data with unicode symbols
    let mailOptions = {
        from: 'AutoAid', // Sender address
        to: email,
        subject: 'OTP Verification', // Subject line
        text: `Your OTP is: ${otp}`, // Plain text body
        html: `<b>Your OTP is: ${otp}</b>` // HTML body
    };

    try {
        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error in sending email:', error);
    }
};

// Endpoints
app.get('/', (req, res) => {
    res.send('Hello')
});

app.post('/api/register', async (req, res) => {
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
        console.log(req.body)
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
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occurred while processing the request'
        });
    }
});

app.post('/api/verify-email', async (req, res) => {
    const {
        email
    } = req.body;
    const user = await userModel.User.findOne({
        email
    });

    if (!user) {
        return res.status(401).json({
            message: 'User does not exist'
        });
    }

    if (!user.isVerified) {
        return res.status(401).json({
            message: 'Email not Verified'
        });
    }

    const otp = crypto.randomInt(100000, 1000000);
    sendVerificationEmail(email, otp);
})

app.post('/api/change-password', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    const user = await userModel.User.findOne({
        email
    });

    // Check if user exists
    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }
});

app.post('/api/verify', async (req, res) => {
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
            return res.status(404).send('User not found.');
        }

        user.isVerified = true;
        // Check if the OTP matches
        if (user.otp == otpNumber) {
            res.status(200).json({
                message: 'Account verified successfully!'
            });
        } else {
            res.status(400).json({
                message: 'Invalid OTP. Please try again.'
            });
        }
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).send('An error occurred during verification.');
    }
});

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};
const secretKey = generateSecretKey();

app.post('/api/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    const user = await userModel.User.findOne({
        email
    });

    if (!user) {
        return res.status(401).json({
            message: 'User does not exist'
        });
    }

    // Check if the password matches (You should use a proper password hashing library for security)
    if (user.password !== password) {
        return res.status(401).json({
            message: 'Invalid Password'
        });
    }
    const token = jwt.sign({
        userId: user._id
    }, secretKey);

    // Successful login
    return res.status(200).json({
        message: "Login Successful",
        role: user.__t,
        token: token,
    });
});


// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});