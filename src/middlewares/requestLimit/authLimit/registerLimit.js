import { API_ATTEMPTS_LIMIT, AUTH_ATTEMPTS_WINDOW } from '../../../constants/lifetimeVars.js';
import createRequestLimit from '../createRequestLimit.js';

/**
 * Rate limiter specifically for user registration attempts.
 *
 * Uses `createRequestLimit` to restrict the number of registration requests
 * a client can make within a defined time window, helping to prevent abuse
 * or automated account creation.
 *
 * Configuration:
 * - `windowMs`: Duration (ms) of the request tracking window.
 * - `max`: Maximum number of allowed registration attempts per window.
 *
 * @constant
 * @type {import('express').RequestHandler[]}
 *
 * @example
 * // Apply to the registration route
 * app.post('/auth/register', ...registerLimit, registerHandler);
 */
export const registerLimit = createRequestLimit({
  windowMs: AUTH_ATTEMPTS_WINDOW, // 15 minutes
  max: API_ATTEMPTS_LIMIT,
});

export default registerLimit;
