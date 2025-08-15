import slowDown from 'express-slow-down';

/**
 * Slow down middleware per IP for login route.
 * Adds delay after 3 attempts up to 5 seconds.
 */
const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Begin slowing down responses after 5 requests
  delayMs: () => 5000, // Slow down subsequent responses by 5000ms
  maxDelayMs: 60000, // Maximum delay of 60 seconds
  message: {
    status: 429,
    message: 'Too many login attempts. Please try again later.',
  },
});

export default loginSlowDown;
