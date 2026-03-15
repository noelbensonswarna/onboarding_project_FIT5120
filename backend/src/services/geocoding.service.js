'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const logger = require('../utils/logger');

const CSV_PATH = path.join(__dirname, '../data/au.csv');

/** @type {Array<{ city: string, lat: number, lng: number, admin_name: string }>} */
let suburbs = null;

/**
 * Load and parse the au.csv dataset once, then cache it in memory.
 */
function loadSuburbs() {
  if (suburbs) return suburbs;
  const raw = fs.readFileSync(CSV_PATH, 'utf8');
  const records = parse(raw, { columns: true, skip_empty_lines: true });
  suburbs = records.map((r) => ({
    city: r.city.trim(),
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lng),
    state: r.admin_name.trim(),
  }));
  logger.info('Suburb dataset loaded', { count: suburbs.length });
  return suburbs;
}

/**
 * Look up an Australian suburb by name in the local CSV dataset.
 *
 * @param {string} suburb - The suburb/city name to look up.
 * @returns {{ name: string, state: string, latitude: number, longitude: number }}
 * @throws {Error} If the suburb is not found in the dataset.
 */
function geocodeSuburb(suburb) {
  const data = loadSuburbs();
  const query = suburb.trim().toLowerCase();

  const match = data.find((s) => s.city.toLowerCase() === query);

  if (!match) {
    logger.info('Suburb not found in dataset', { suburb });
    const err = new Error(`Suburb "${suburb}" not found. Please check the spelling and try again.`);
    err.statusCode = 400;
    throw err;
  }

  logger.info('Suburb found in dataset', { suburb: match.city, lat: match.lat, lng: match.lng, state: match.state });
  return { name: match.city, state: match.state, latitude: match.lat, longitude: match.lng };
}

module.exports = { geocodeSuburb };
