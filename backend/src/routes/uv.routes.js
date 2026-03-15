'use strict';

const { Router } = require('express');
const { getUVIndex, healthCheck } = require('../controllers/uv.controller');
const { validateSuburb } = require('../middleware/validation');

const router = Router();

/** GET /api/health — liveness probe */
router.get('/health', healthCheck);

/** POST /api/uv-index — main UV lookup endpoint */
router.post('/uv-index', validateSuburb, getUVIndex);

module.exports = router;
