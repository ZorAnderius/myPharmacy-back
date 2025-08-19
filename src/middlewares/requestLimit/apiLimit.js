import { API_ATTEMPTS_LIMIT, API_ATTEMPTS_WINDOW } from "../../constants/lifetimeVars.js";
import createRequestLimit from "./createRequestLimit.js";

/**
 * General API request rate limiter.
 *
 * Uses `createRequestLimit` to prevent clients from making too many requests
 * in a short period of time, protecting the API from abuse or accidental overload.
 *
 * Configuration:
 * - `windowMs`: Duration (ms) of the request tracking window.
 * - `max`: Maximum allowed requests within the window.
 * - `message`: Error response sent when the limit is exceeded.
 *
 * Unlike `sensitiveLimiter`, this limiter does not introduce gradual delays,
 * only strict request caps per time window.
 *
 * @constant
 * @type {import('express').RequestHandler[]}
 *
 * @example
 * // Apply to all API routes
 * router.get('/products', ...apiLimit);
 */
const apiLimit = createRequestLimit({
  windowMs: API_ATTEMPTS_WINDOW,
  max: API_ATTEMPTS_LIMIT,
  message: { status: 429, message: 'Too many requests. Slow down.' },
});

export default apiLimit;
