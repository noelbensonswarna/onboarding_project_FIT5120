'use strict';

const LOG_LEVELS = { debug: 0, info: 1, error: 2 };
const configuredLevel = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.debug;

/**
 * Simple logger that respects LOG_LEVEL env var.
 * Prints to stdout (info/debug) and stderr (error).
 */
const logger = {
  debug(message, meta = {}) {
    if (configuredLevel <= LOG_LEVELS.debug) {
      console.log(JSON.stringify({ level: 'debug', message, ...meta, ts: new Date().toISOString() }));
    }
  },

  info(message, meta = {}) {
    if (configuredLevel <= LOG_LEVELS.info) {
      console.log(JSON.stringify({ level: 'info', message, ...meta, ts: new Date().toISOString() }));
    }
  },

  error(message, meta = {}) {
    console.error(JSON.stringify({ level: 'error', message, ...meta, ts: new Date().toISOString() }));
  },
};

module.exports = logger;
