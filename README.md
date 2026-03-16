# Sunny Side Up — FIT5120 Onboarding Project

## Overview

Sunny Side Up is a sun safety web application developed as part of the FIT5120 onboarding project at Monash University. The application enables Australian users to retrieve real-time UV index information and personalised sun safety advice based on their location.

## Purpose

This project serves as an introductory exercise to familiarise students with full-stack web development practices, including frontend UI development, RESTful API design, external API integration, and basic software engineering workflows such as version control and environment configuration.

## Features

- **Location-based UV lookup** — Users enter an Australian city to retrieve the current daily maximum UV index.
- **Safety advice** — Colour-coded UV level indicators with evidence-based sun protection recommendations.
- **Awareness page** — Data visualisations presenting melanoma trends and city-level UV statistics in Australia.
- **Local dataset** — Suburb-to-coordinate resolution using a bundled Australian cities dataset, removing the dependency on a third-party geocoding API.
- **Caching and rate limiting** — Backend optimisations to reduce redundant external API calls and prevent abuse.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Vue 3, Vue Router, Chart.js, Vite |
| Backend  | Node.js, Express                  |
| Data     | Open-Meteo Weather API, local CSV |

## Project Structure

```
Onboarding/
├── frontend/          # Vue.js single-page application
│   ├── src/
│   │   ├── views/     # LocationInput, UVTracker, Awareness pages
│   │   └── router/    # Client-side routing
│   └── package.json
├── backend/           # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
└── dataset/
    └── au.csv         # Australian cities dataset
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

> Both the backend and frontend must be running simultaneously for the application to function correctly.

## API Reference

### `POST /api/uv-index`

Retrieves the daily maximum UV index for a given Australian city.

**Request body:**
```json
{ "suburb": "Melbourne" }
```

**Response:**
```json
{
  "suburb": "Melbourne",
  "state": "Victoria",
  "lat": -37.8142,
  "lng": 144.9631,
  "uv_index": 6.7,
  "safety_level": "High",
  "safety_advice": "Wear sunscreen SPF 30+, hat, and sunglasses. Limit sun exposure between 10am–4pm.",
  "timestamp": "2026-03-15T08:00:00.000Z",
  "fromCache": false
}
```

### `GET /api/health`

Returns the health status of the API server.

## Acknowledgements

- UV forecast data provided by [Open-Meteo](https://open-meteo.com/) (free, no API key required)
- Australian cities dataset sourced from public geographic data
- Developed for FIT5120 — Industry Experience Studio, Monash University
