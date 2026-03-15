'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const uvRoutes = require('./routes/uv.routes');
const logger = require('./utils/logger');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vue dev server
      // Add your production domain here when deploying, e.g.:
      // 'https://sunnysideup.example.com',
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// ─── Body parsing (limit 10 kb to prevent payload attacks) ───────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Request logging ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info('Incoming request', { method: req.method, path: req.path });
  next();
});

// ─── Rate limiting ───────────────────────────────────────────────────────────
app.use('/api', rateLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', uvRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Sunny Side Up backend running`, {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
  });
});

module.exports = app;
