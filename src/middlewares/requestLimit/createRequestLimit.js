import rateLimitFunc from './requestBasicMiddleware/rateLimit.js';
import slowDownFunc from './requestBasicMiddleware/slowDown.js';

/**
 * Creates a combined request throttling and rate-limiting middleware stack.
 *
 * This utility wraps both:
 * - `slowDownFunc`: Gradually introduces delays after a configurable number of requests.
 * - `rateLimitFunc`: Enforces a maximum number of requests within a time window.
 *
 * Returned value is an array of middleware functions to be applied in sequence.
 *
 * @function createRequestLimit
 * @param {Object} options - Configuration options.
 * @param {number} [options.windowMs=60000] - Time window in milliseconds for tracking requests.
 * @param {number} [options.max=60] - Maximum number of allowed requests per window.
 * @param {number} [options.delayAfter=0] - Number of requests before applying delays.
 * @param {number} [options.delayMsec] - Initial delay in milliseconds once `delayAfter` is exceeded.
 * @param {number} [options.maxDelayMs=0] - Maximum delay cap in milliseconds.
 * @param {{status: number, message: string}} [options.message={status:429, message:'Too many requests'}]
 *   - Response payload returned when the request limit is exceeded.
 *
 * @returns {import('express').RequestHandler[]} An array of Express middlewares:
 *   `[slowDownMiddleware, rateLimitMiddleware]`.
 */
const createRequestLimit = ({
  windowMs = 60 * 1000,
  max = 60,
  delayAfter = 0,
  delayMsec,
  maxDelayMs = 0,
  message = { status: 429, message: 'Too many requests' },
}) => {
  const slowDownMiddleware = slowDownFunc({
    windowMs,
    delayAfter,
    delayMsec,
    maxDelayMs,
    message,
  });

  const rateLimitMiddleware = rateLimitFunc({
    windowMs,
    max,
    message,
  });

  return [slowDownMiddleware, rateLimitMiddleware];
};

export default createRequestLimit;
