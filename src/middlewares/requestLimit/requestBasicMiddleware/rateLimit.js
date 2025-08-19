import rateLimit from 'express-rate-limit';
import customIpKeyGenerator from './ipKeyGenertor.js';

/**
 * Creates a strict request rate limiting middleware using `express-rate-limit`.
 *
 * Unlike {@link slowDownFunc}, which introduces delays, this middleware enforces
 * a hard cap on the number of requests allowed within a given time window.
 *
 * @function rateLimitFunc
 * @param {Object} options - Configuration options.
 * @param {number} [options.windowMs=60000] - Time window (in milliseconds) for request tracking.
 * @param {number} [options.max=60] - Maximum number of requests allowed per window per client.
 * @param {{status: number, message: string}} [options.message] - Response payload when the rate limit is exceeded.
 *
 * @returns {import('express').RequestHandler} An Express middleware that blocks requests once the limit is reached.
 */
const rateLimitFunc = ({ windowMs = 60 * 1000, max = 60, message }) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator: customIpKeyGenerator,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message,
  });

export default rateLimitFunc;
