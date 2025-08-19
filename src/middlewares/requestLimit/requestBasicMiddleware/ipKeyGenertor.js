import { ipKeyGenerator } from 'express-rate-limit';

/**
 * Custom key generator for request limiting middlewares.
 *
 * - If the request body contains an `email` field, it uses the normalized email
 *   (`trim()` + `toLowerCase()`) as the unique key.
 * - Otherwise, it falls back to `ipKeyGenerator` (e.g., client IP address).
 *
 * This is useful for rate limiting login or signup attempts per user identity
 * instead of just per IP, while still covering cases without an email.
 *
 * @function customIpKeyGenerator
 * @param {import('express').Request} req - The Express request object.
 * @returns {string} A unique identifier for rate limiting (email or IP).
 */
const customIpKeyGenerator = req => {
  if (req.body?.email) {
    return req.body.email.trim().toLowerCase();
  }
  return ipKeyGenerator(req);
};

export default customIpKeyGenerator;