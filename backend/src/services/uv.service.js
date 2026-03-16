'use strict';

const axios = require('../utils/httpClient');
const logger = require('../utils/logger');
const { UV_LEVELS } = require('../utils/constants');

const UV_URL = 'https://currentuvindex.com/api/v1/uvi';
const timeout = parseInt(process.env.API_TIMEOUT, 10) || 60000;

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
 * Fetch the current UV index for a given latitude/longitude from currentuvindex.com.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{ uvIndex: number, safetyLevel: string, safetyAdvice: string }>}
 * @throws {Error} If the external API call fails.
 */
async function fetchUVIndex(latitude, longitude) {
  logger.info('Fetching UV index', { latitude, longitude });

  let response;
  try {
    response = await axios.get(UV_URL, {
      params: { latitude, longitude },
      timeout,
    });
  } catch (err) {
    logger.error('UV API request failed', { latitude, longitude, error: err.message });
    const apiErr = new Error('UV forecast service unavailable. Please try again later.');
    apiErr.statusCode = 503;
    throw apiErr;
  }

  const data = response.data;

  if (!data.ok) {
    logger.error('UV API returned error', { message: data.message });
    const apiErr = new Error(data.message || 'UV forecast service unavailable.');
    apiErr.statusCode = 503;
    throw apiErr;
  }

  const uvIndex = data.now?.uvi;
  if (uvIndex === undefined || uvIndex === null) {
    logger.error('Unexpected UV API response structure', { data });
    const parseErr = new Error('Could not parse UV index from forecast service.');
    parseErr.statusCode = 503;
    throw parseErr;
  }

  const { level, advice } = getSafetyInfo(uvIndex);
  logger.info('UV index fetched', { latitude, longitude, uvIndex, level });

  return { uvIndex, safetyLevel: level, safetyAdvice: advice };
}

module.exports = { fetchUVIndex };
