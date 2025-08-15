import checkUserLimit from './checkUserLimit.js';
import loginRateLimit from './loginRateLimit.js';
import loginSlowDown from './loginSlowDown.js';

/**
 * Unified middleware for login protection.
 * Sequentially applies:
 * 1. User-based attempt limit
 * 2. Slow down per IP
 * 3. Rate limit per IP
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const loginLimit = (req, res, next) => {
  checkUserLimit(req, res, err => {
    if (err) return next(err);
    loginSlowDown(req, res, err => {
      if (err) return next(err);
      loginRateLimit(req, res, next);
    });
  });
};

export default loginLimit;
