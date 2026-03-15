'use strict';

const logger = require('../utils/logger');

/**
 * Global Express error handler.
 * Must be registered AFTER all routes (four-argument signature required by Express).
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;

  logger.error(err.message, {
    statusCode: status,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  const message =
    status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message;

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
