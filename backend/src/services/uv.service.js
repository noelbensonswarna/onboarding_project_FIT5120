'use strict';

const axios = require('../utils/httpClient');
const logger = require('../utils/logger');
const { UV_LEVELS, AUSTRALIA_TIMEZONES, DEFAULT_TIMEZONE } = require('../utils/constants');

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const timeout = parseInt(process.env.API_TIMEOUT, 10) || 5000;

/**
 * Determine the safety level and advice for a given UV index value.
 *
 * @param {number} uvIndex - The UV index value.
 * @returns {{ level: string, advice: string }}
 */
function getSafetyInfo(uvIndex) {
  const floored = Math.floor(uvIndex);
  const entry = UV_LEVELS.find((l) => floored >= l.min && floored <= l.max);
  return { level: entry.level, advice: entry.advice };
}

/**
 * Fetch the daily maximum UV index for a given latitude/longitude from Open-Meteo.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} state - Australian state name used to resolve timezone.
 * @returns {Promise<{ uvIndex: number, safetyLevel: string, safetyAdvice: string }>}
 * @throws {Error} If the external API call fails.
 */
async function fetchUVIndex(latitude, longitude, state) {
  const timezone = AUSTRALIA_TIMEZONES[state] ?? DEFAULT_TIMEZONE;
  logger.info('Fetching UV index', { latitude, longitude, timezone });

  let response;
  try {
    response = await axios.get(FORECAST_URL, {
      params: {
        latitude,
        longitude,
        daily: 'uv_index_max',
        timezone,
        forecast_days: 1,
      },
      timeout,
    });
  } catch (err) {
    logger.error('UV forecast API request failed', { latitude, longitude, error: err.message });
    const apiErr = new Error('UV forecast service unavailable. Please try again later.');
    apiErr.statusCode = 503;
    throw apiErr;
  }

  const uvIndex = response.data?.daily?.uv_index_max?.[0];
  if (uvIndex === undefined || uvIndex === null) {
    logger.error('Unexpected UV API response structure', { data: response.data });
    const parseErr = new Error('Could not parse UV index from forecast service.');
    parseErr.statusCode = 503;
    throw parseErr;
  }

  const { level, advice } = getSafetyInfo(uvIndex);
  logger.info('UV index fetched', { latitude, longitude, uvIndex, level });

  return { uvIndex, safetyLevel: level, safetyAdvice: advice };
}

module.exports = { fetchUVIndex };
