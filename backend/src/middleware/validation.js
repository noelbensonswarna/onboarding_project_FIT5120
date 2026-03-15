'use strict';

/**
 * Validate the `suburb` field in the POST /api/uv-index request body.
 * Rules:
 *   - Must be present and non-empty.
 *   - Max 100 characters.
 *   - Only letters, spaces, and hyphens allowed.
 */
function validateSuburb(req, res, next) {
  const { suburb } = req.body;

  if (!suburb || typeof suburb !== 'string' || suburb.trim().length === 0) {
    return res.status(400).json({ error: 'Suburb name is required.' });
  }

  if (suburb.trim().length > 100) {
    return res.status(400).json({ error: 'Suburb name must be 100 characters or fewer.' });
  }

  if (!/^[a-zA-Z\s-]+$/.test(suburb.trim())) {
    return res.status(400).json({
      error: 'Suburb name may only contain letters, spaces, and hyphens.',
    });
  }

  // Sanitise the value on the request object so controllers can trust it.
  req.body.suburb = suburb.trim();
  next();
}

module.exports = { validateSuburb };
