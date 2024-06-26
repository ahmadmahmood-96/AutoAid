require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", false);

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const insuranceRoutes = require("./routes/insuranceRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const workshopRoutes = require("./routes/workshopRoutes");
const mileageRoutes = require("./routes/mileageRoutes");

// Importing Verifying Token Middleware
const verifyToken = require("./middleware/verify");

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
}));

// Database Setup
const URI = process.env.MONGODB_URL;
mongoose
    .connect(URI)
    .then((res) => {
        console.log('MongoDB Connected');
    })
    .catch((error) => {
        console.log(error.message);
    });

// Routes
app.use('/auth', authRoutes);
app.use('/product', verifyToken, productRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', verifyToken, adminRoutes);
app.use('/insurance', verifyToken, insuranceRoutes);
app.use('/service', verifyToken, serviceRoutes);
app.use('/workshop', verifyToken, workshopRoutes);
app.use('/mileage', verifyToken, mileageRoutes);

// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});