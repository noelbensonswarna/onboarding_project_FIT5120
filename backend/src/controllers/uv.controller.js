'use strict';

const { geocodeSuburb } = require('../services/geocoding.service');
const { fetchUVIndex } = require('../services/uv.service');
const cacheService = require('../services/cache.service');
const logger = require('../utils/logger');

/**
 * POST /api/uv-index
 *
 * Accepts a suburb name, geocodes it, fetches the UV forecast, and returns
 * formatted UV index data with safety advice. Results are cached for 1 hour.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getUVIndex(req, res, next) {
  const { suburb } = req.body;
  const cacheKey = suburb.toLowerCase();

  try {
    // Check cache first.
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Geocode suburb → coordinates.
    const { name, state, latitude, longitude } = await geocodeSuburb(suburb);

    // Fetch UV forecast.
    const { uvIndex, safetyLevel, safetyAdvice } = await fetchUVIndex(latitude, longitude, state);

    const payload = {
      suburb: name,
      state,
      lat: latitude,
      lng: longitude,
      uv_index: uvIndex,
      safety_level: safetyLevel,
      safety_advice: safetyAdvice,
      timestamp: new Date().toISOString(),
      fromCache: false,
    };

    cacheService.set(cacheKey, payload);
    logger.info('UV index response sent', { suburb: name, uvIndex });

    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/health
 * Simple health check endpoint.
 */
function healthCheck(req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}

module.exports = { getUVIndex, healthCheck };
