// server/server.js

// 1. Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware setup
app.use(cors()); // Allows cross-origin requests from client
app.use(express.json()); // Allows server to accept JSON data in the request body

// 4. Simple Welcome Route (Step 3 will expand this)
app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

// 5. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));