'use strict';

const { pool } = require('../utils/db');
const logger = require('../utils/logger');

/**
 * Look up an Australian suburb by name in the RDS MySQL database.
 *
 * @param {string} suburb - The suburb/city name to look up.
 * @returns {Promise<{ name: string, state: string, latitude: number, longitude: number }>}
 * @throws {Error} If the suburb is not found or the DB query fails.
 */
async function geocodeSuburb(suburb) {
  const query = suburb.trim();

  let rows;
  try {
    [rows] = await pool.query(
      'SELECT suburbs, lat, lng, admin_name FROM cities WHERE LOWER(suburbs) = LOWER(?) LIMIT 1',
      [query]
    );
  } catch (err) {
    logger.error('Database query failed', { suburb, error: err.message });
    const dbErr = new Error('Location service unavailable. Please try again later.');
    dbErr.statusCode = 503;
    throw dbErr;
  }

  if (rows.length === 0) {
    logger.info('Suburb not found in database', { suburb });
    const notFound = new Error("Please enter a valid City!");
    notFound.statusCode = 400;
    throw notFound;
  }

  const { suburbs: name, lat, lng, admin_name: state } = rows[0];
  logger.info('Suburb found in database', { suburb: name, lat, lng, state });

  return { name, state, latitude: parseFloat(lat), longitude: parseFloat(lng) };
}

module.exports = { geocodeSuburb };
