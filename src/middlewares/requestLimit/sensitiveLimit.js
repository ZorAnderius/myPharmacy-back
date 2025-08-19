import { SENSITIVE_ATTEMPTS_LIMIT, SENSITIVE_ATTEMPTS_WINDOW } from '../../constants/lifetimeVars.js';
import createRequestLimit from './createRequestLimit.js';

/**
 * Rate limiter for sensitive user actions (e.g., login, password reset).
 *
 * This middleware is created via `createRequestLimit` and helps prevent
 * brute-force or abuse attempts by throttling repeated requests.
 *
 * Configuration:
 * - `windowMs`: Time window for tracking requests (milliseconds).
 * - `max`: Maximum number of allowed attempts in the window before blocking.
 * - `delayAfter`: Number of attempts before starting to introduce delays.
 * - `delayMs`: Initial delay applied once `delayAfter` is exceeded.
 * - `maxDelayMs`: Maximum delay between requests.
 * - `message`: Response payload sent when the limit is exceeded.
 *
 * @constant
 * @type {import('express').RequestHandler}
 *
 * @example
 * app.post('/auth/login', sensitiveLimiter, loginHandler);
 * app.post('/auth/reset-password', sensitiveLimiter, resetPasswordHandler);
 */
const sensitiveLimiter = createRequestLimit({
  windowMs: SENSITIVE_ATTEMPTS_WINDOW,
  max: SENSITIVE_ATTEMPTS_LIMIT,
  delayAfter: 5,
  delayMs: 2000,
  maxDelayMs: 30000,
  message: { status: 429, message: 'Too many sensitive actions. Try later.' },
});

export default sensitiveLimiter;