require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

// Middleware
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

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
app.use('/product', productRoutes);

app.get('/', (req, res) => {
    res.send(`<h2>Hello</h2>`);
});

// Server Listening
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});