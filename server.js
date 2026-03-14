const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 
const db = require('./db');
require('dotenv').config();

const app = express();

// MIDDLEWARE
app.use(cors()); 
app.use(express.json());

// Serve frontend: prefer built `client/dist` if present, otherwise serve `client/` (legacy)
const clientDist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // Fallback to index.html for SPA routes (only for GET requests asking HTML)
    app.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        const accept = req.headers.accept || '';
        if (!accept.includes('text/html')) return next();
        res.sendFile(path.join(clientDist, 'index.html'));
    });
} else {
    app.use(express.static(path.join(__dirname, 'client')));
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'client', 'index.html')));
}

// 1. AUTOMATED DATABASE SETUP
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
app.get('/status', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 'Connected' AS status");
        res.json({ message: "ELIGIX Backend is Live!", db_status: rows[0].status });
    } catch (err) {
        res.status(500).json({ error: "Backend Live, but DB issue: " + err.message });
    }
});

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ success: true, message: "Database is responding!", data: rows[0].result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- ADDED NEW ROUTES HERE ---

// ShopAI: products API (no DB required)
app.get('/api/products', (req, res) => {
  try {
    const data = require('./data/products');
    const list = Array.isArray(data?.products) ? data.products : [];
    return res.json(list.length ? list : [{ id: 1, name: 'Sample Product', category: 'Electronics', price: 99, rating: 4.5, reviewCount: 0, image: 'https://via.placeholder.com/300', description: 'Demo' }]);
  } catch (e) {
    return res.json([{ id: 1, name: 'Demo Product', category: 'Electronics', price: 99, rating: 4.5, reviewCount: 0, image: 'https://via.placeholder.com/300', description: 'Demo' }]);
  }
});

// Route to get all registered students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to register a student (So your friend can send data)
app.post('/api/students/register', async (req, res) => {
    const { name, email, branch } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO students (name, email, branch) VALUES (?, ?, ?)',
            [name, email, branch]
        );
        res.status(201).json({ message: "Student registered!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ------------------------------

// 3. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 ELIGIX Server running on port ${PORT}`);
    await initDatabase(); 
});

// (Serving handled above depending on build presence)
