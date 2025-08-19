import slowDown from 'express-slow-down';
import customIpKeyGenerator from './ipKeyGenertor.js';

/**
 * Creates a request slowdown middleware using `express-slow-down`.
 *
 * This middleware gradually increases the response delay once a client exceeds
 * a configurable request threshold (`delayAfter`) within the given time window.
 * It is useful for throttling aggressive clients without fully blocking them.
 *
 * @function slowDownFunc
 * @param {Object} options - Configuration options.
 * @param {number} [options.windowMs=60000] - Time window (in milliseconds) for request tracking.
 * @param {number} [options.delayAfter=0] - Number of requests allowed before starting to delay responses.
 * @param {number} [options.delayMsec] - Delay (in ms) to apply after `delayAfter` requests.
 * @param {number} [options.maxDelayMs=0] - Maximum cap for delays (in ms).
 * @param {{status: number, message: string}} [options.message] - Optional response payload when limits are enforced.
 *
 * @returns {import('express').RequestHandler} An Express middleware that slows down excessive requests.
 */
const slowDownFunc = ({ windowMs = 60 * 1000, delayAfter = 0, delayMsec, maxDelayMs = 0, message }) => {
  return slowDown({
    windowMs,
    delayAfter,
    delayMs: () => delayMsec || 0,
    maxDelayMs,
    keyGenerator: customIpKeyGenerator,
    message,
  });
};

export default slowDownFunc;
