# Sunny Side Up — Backend

Node.js + Express API that geocodes Australian suburbs and returns UV index data with safety advice.

## Quick Start

```bash
cd backend
cp .env.example .env
npm install
npm run dev      # development (nodemon)
# or
npm start        # production
```

The server starts on **http://localhost:3000** by default.

## API Endpoints

### `GET /api/health`
Liveness check.

```json
{ "status": "ok", "timestamp": "2024-03-15T10:00:00.000Z" }
```

### `POST /api/uv-index`
Returns UV index and safety advice for an Australian suburb.

**Request**
```json
{ "suburb": "Melbourne" }
```

**Success response (200)**
```json
{
  "suburb": "Melbourne",
  "state": "Victoria",
  "lat": -37.814,
  "lng": 144.9633,
  "uv_index": 8.2,
  "safety_level": "Very High",
  "safety_advice": "Avoid sun exposure between 10am–4pm. Wear protective clothing, SPF 50+ sunscreen, hat, and sunglasses.",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "fromCache": false
}
```

**Error responses**
| Status | Reason |
|--------|--------|
| 400 | Invalid or unknown suburb |
| 429 | Rate limit exceeded (30 req / 15 min per IP) |
| 503 | External geocoding or UV API unavailable |
| 500 | Unexpected server error |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `LOG_LEVEL` | `debug` | `debug` / `info` / `error` |
| `API_TIMEOUT` | `5000` | External API timeout (ms) |
| `CACHE_TTL` | `3600` | Cache duration (seconds) |

## Project Structure

```
src/
├── index.js                   # Express app bootstrap
├── routes/uv.routes.js        # Route definitions
├── controllers/uv.controller.js
├── services/
│   ├── geocoding.service.js   # Open-Meteo Geocoding API
│   ├── uv.service.js          # Open-Meteo Forecast API
│   └── cache.service.js       # In-memory cache (node-cache)
├── middleware/
│   ├── validation.js          # Input validation
│   ├── rateLimiter.js         # express-rate-limit
│   └── errorHandler.js        # Global error handler
└── utils/
    ├── constants.js            # UV levels, timezones
    └── logger.js               # JSON structured logger
```
