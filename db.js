const mysql = require('mysql2');
require('dotenv').config();

// Secure Pool Configuration for ELIGIX
// This setup uses Environment Variables exclusively for safety
const pool = mysql.createPool({
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT || 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true 
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connection test logic
pool.getConnection((err, conn) => {
    if (err) {
        console.error('❌ ELIGIX Database Connection Failed: ' + err.message);
    } else {
        console.log('✅ ELIGIX Database Connected safely via TiDB Pool!');
        conn.release(); // Important: Release the connection back to the pool
    }
});

// Export promise-based version for server.js to use async/await
module.exports = pool.promise();