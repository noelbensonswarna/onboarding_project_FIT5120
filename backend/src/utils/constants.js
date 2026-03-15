'use strict';

/**
 * UV index safety levels and their corresponding advice.
 * Based on WHO and Australian Radiation Protection guidelines.
 */
const UV_LEVELS = [
  {
    min: 0,
    max: 2,
    level: 'Low',
    advice: 'No protection needed. You can safely stay outside.',
  },
  {
    min: 3,
    max: 5,
    level: 'Moderate',
    advice: 'Wear sunscreen SPF 30+, a hat, and sunglasses when outside.',
  },
  {
    min: 6,
    max: 7,
    level: 'High',
    advice:
      'Wear sunscreen SPF 30+, hat, and sunglasses. Limit sun exposure between 10am–4pm.',
  },
  {
    min: 8,
    max: 10,
    level: 'Very High',
    advice:
      'Avoid sun exposure between 10am–4pm. Wear protective clothing, SPF 50+ sunscreen, hat, and sunglasses.',
  },
  {
    min: 11,
    max: Infinity,
    level: 'Extreme',
    advice:
      'Stay indoors if possible. If you must go outside, full sun protection is essential.',
  },
];

/**
 * Australia-specific timezone mapping by state abbreviation or admin1 name.
 */
const AUSTRALIA_TIMEZONES = {
  'New South Wales': 'Australia/Sydney',
  Victoria: 'Australia/Melbourne',
  Queensland: 'Australia/Brisbane',
  'Western Australia': 'Australia/Perth',
  'South Australia': 'Australia/Adelaide',
  'Northern Territory': 'Australia/Darwin',
  Tasmania: 'Australia/Hobart',
  'Australian Capital Territory': 'Australia/Sydney',
};

const DEFAULT_TIMEZONE = 'Australia/Sydney';

module.exports = { UV_LEVELS, AUSTRALIA_TIMEZONES, DEFAULT_TIMEZONE };
