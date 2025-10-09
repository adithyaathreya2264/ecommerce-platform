// server/config/db.js

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Mongoose connect method, using the URI from the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Options to avoid deprecation warnings (standard for Mongoose 6+)
            // These are often implicitly true in newer versions, but good practice to include or verify
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;