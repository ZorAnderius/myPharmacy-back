import { AUTH_ATTEMPTS_LIMIT, AUTH_ATTEMPTS_WINDOW } from '../../../constants/lifetimeVars.js';
import createRequestLimit from '../createRequestLimit.js';

/**
 * Rate limiter for authentication-related actions (e.g., login attempts).
 *
 * Uses `createRequestLimit` to limit the number of requests a client can make
 * within a specific window. After a small number of attempts (`delayAfter`),
 * it starts introducing delays to slow down repeated requests.
 *
 * Configuration:
 * - `windowMs`: Time window (ms) for request tracking.
 * - `max`: Maximum allowed authentication attempts per window.
 * - `delayAfter`: Number of requests before applying incremental delays.
 * - `delayMsec`: Initial delay in milliseconds after `delayAfter` is exceeded.
 * - `maxDelayMs`: Maximum delay allowed per request.
 *
 * @constant
 * @type {import('express').RequestHandler[]}
 */
const authLimit = createRequestLimit({
  windowMs: AUTH_ATTEMPTS_WINDOW,
  max: AUTH_ATTEMPTS_LIMIT,
  delayAfter: 2,
  delayMsec: 5000,
  maxDelayMs: 60000,
});

export default authLimit;