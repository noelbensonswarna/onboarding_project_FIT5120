'use strict';

const NodeCache = require('node-cache');
const logger = require('../utils/logger');

const ttl = parseInt(process.env.CACHE_TTL, 10) || 3600;
const cache = new NodeCache({ stdTTL: ttl, checkperiod: ttl * 0.2 });

/**
 * Retrieve a cached value by key.
 * @param {string} key - Cache key (typically a lowercase suburb name).
 * @returns {object|undefined} Cached value, or undefined on miss.
 */
function get(key) {
  const value = cache.get(key);
  if (value !== undefined) {
    logger.debug('Cache hit', { key });
  } else {
    logger.debug('Cache miss', { key });
  }
  return value;
}

/**
 * Store a value in the cache.
 * @param {string} key - Cache key.
 * @param {object} value - Value to store.
 */
function set(key, value) {
  cache.set(key, value);
  logger.debug('Cache set', { key, ttlSeconds: ttl });
}

module.exports = { get, set };
