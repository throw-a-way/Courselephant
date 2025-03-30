const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse incoming JSON requests
app.use(express.json());

// Import route handlers
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Set up routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/admin", adminRoutes);

// Main function to handle database connection and server startup
async function main() {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log("Successfully connected to the Database");

        // Start the server only after the database connection is established
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database", error);
        console.log("Stopping the server startup process");
        process.exit(1); // Exit the process with a failure code
    }
}

// Execute the main function
main();