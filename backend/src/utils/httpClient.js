'use strict';

const axios = require('axios');
const https = require('https');
const http = require('http');

/**
 * Shared axios instance that forces IPv4 to avoid ETIMEDOUT on systems where
 * Node.js prefers IPv6 but the remote host only responds on IPv4.
 */
const httpClient = axios.create({
  httpAgent: new http.Agent({ family: 4 }),
  httpsAgent: new https.Agent({ family: 4 }),
});

module.exports = httpClient;
