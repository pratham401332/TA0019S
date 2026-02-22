const express = require('express');
const cors = require('cors'); // Essential for frontend-backend communication
const db = require('./db');
require('dotenv').config();

const app = express();

// MIDDLEWARE
app.use(cors()); // Allows your friend's frontend to talk to this server
app.use(express.json());

// 1. AUTOMATED DATABASE SETUP
// This function creates your "students" table automatically if it doesn't exist
const initDatabase = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                branch VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Database tables verified/created.");
    } catch (err) {
        console.error("❌ Database initialization error: " + err.message);
    }
};

// 2. ROUTES
// Combined Status Route
app.get('/status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT "Connected" AS status');
        res.json({ 
            message: "ELIGIX Backend is Live!", 
            db_status: rows[0].status 
        });
    } catch (err) {
        res.status(500).json({ error: "Backend Live, but DB issue: " + err.message });
    }
});

// Combined Test Route for you and your friend
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ 
            success: true, 
            message: "Database is responding!", 
            data: rows[0].result 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 ELIGIX Server running on http://localhost:${PORT}`);
    // This part makes the setup automatic
    await initDatabase(); 
});