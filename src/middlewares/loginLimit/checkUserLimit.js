/**
 * In-memory attempt tracker per user.
 * Key: username (or email).
 * Value: { count: number, firstAttemptTime: timestamp }.
 * @type {Map<string, {count: number, firstAttemptTime: number}>}
 */
const userAttempts = new Map();

/** Maximum login attempts per user */
const MAX_USER_ATTEMPTS = 5;
/** Time window for user limit in milliseconds */
const USER_WINDOW_TIME = 15 * 60 * 1000; // 15 minutes

/**
 * Middleware to check per-user login attempt limit.
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 * @param {import('express').NextFunction} next - Next middleware
 */
const checkUserLimit = (req, res, next) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) {
    return next(new Error('Email is required.'));
  }
  const currentTime = Date.now();
  const attempt = userAttempts.get(email) || { count: 0, firstAttemptTime: currentTime };

  // Update attempt count or reset if time window has passed
  if (currentTime - attempt.firstAttemptTime > USER_WINDOW_TIME) {
    attempt.count = 1;
    attempt.firstAttemptTime = currentTime;
  } else {
    attempt.count += 1;
  }

  userAttempts.set(email, attempt);

  if (attempt.count >= MAX_USER_ATTEMPTS) {
    return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
  }

  next();
};

export default checkUserLimit;
