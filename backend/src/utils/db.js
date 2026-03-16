'use strict';

const mysql = require('mysql2/promise');
const logger = require('./logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000,
});

/**
 * Test the database connection on startup.
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    logger.info('Database connection established', { host: process.env.DB_HOST });
    conn.release();
  } catch (err) {
    logger.error('Database connection failed', { error: err.message });
    throw err;
  }
}

module.exports = { pool, testConnection };
