const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
         minVersion: 'TLSv1.2',
        rejectUnauthorized: false
    }
});


// Export the promise-based version so we can use async/await
module.exports = pool.promise();