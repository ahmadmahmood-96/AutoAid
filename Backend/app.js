require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Importing Routes
const authRoutes = require("./routes/authRoutes");

// Importing Middleware
const verifyMiddleware = require("./middleware/verify");
const generateErrorPage = require("./middleware/error");

// Middleware
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(verifyMiddleware);

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

app.get('/', (req, res) => {
    res.send(`<h2>Hello</h2>`);
});

// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// For wrong URL's
app.use((req, res, next) => {
    // Create a 404 error page
    console.log('Page not found')
    const errorPage = generateErrorPage("Page Not Found");
    // Set the status to 404
    res.status(404).send(errorPage);
    next();
});