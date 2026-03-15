'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter: 30 requests per 15 minutes per IP address.
 * Returns HTTP 429 with a user-friendly message when the limit is exceeded.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a few minutes before trying again.',
  },
});

module.exports = rateLimiter;
