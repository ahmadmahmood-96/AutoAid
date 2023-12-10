const express = require("express");
const app = express();
const port = 8080;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
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
        let user;

        if (selectedRole === 'vehicleOwner') {
            user = new VehicleOwner({
                name,
                email,
                phoneNumber: number,
                password,
                vehicleType,
            });
        } else if (selectedRole === 'workshopOwner') {
            user = new WorkshopOwner({
                name,
                email,
                phoneNumber: number,
                password,
                workshopName,
                workshopAddress,
            });
        } else if (selectedRole === 'serviceProvider') {
            user = new ServiceProvider({
                name,
                email,
                phoneNumber: number,
                password,
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
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occurred while processing the request'
        });
    }
});


app.post('/api/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Find the user with the provided email
    // const user = await userModel.findOne({
    //     email
    // });
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

    // Successful login
    return res.status(200).json({
        message: "Login Successful",
        user: user,
    });
});


// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});