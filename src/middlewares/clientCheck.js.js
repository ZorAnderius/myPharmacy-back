import { isIP } from "is-ip";

/**
 * Middleware to validate client IP and ensure a User-Agent header exists.
 *
 * - Checks if the request IP is valid using `isIP`.
 * - If User-Agent is missing, sets it to a default value `'Unknown'`.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Callback to pass control to the next middleware.
 * @returns {void} Calls next() if validation passes, otherwise responds with 400 error.
 */
const clientCheck = (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  const safeUserAgent = typeof req.headers['user-agent'] === 'string' ? userAgent.slice(0, 255) : 'unknown';

  if (!isIP(ip)) {
    return next(createHttpError(400, 'Invalid IP address'));
  }

  if (!userAgent) {
    req.headers['user-agent'] = safeUserAgent; 
  }

  next();
};

export default clientCheck;