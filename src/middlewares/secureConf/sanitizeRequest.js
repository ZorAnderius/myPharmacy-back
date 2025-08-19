import { sanitizeObject } from './sanitizeObjects.js';

/**
 * Express middleware that sanitizes incoming request data.
 *
 * Sanitization includes:
 * - Escaping special characters in strings to prevent XSS and other attacks.
 * - Optional context-based escaping for each request source:
 *   - 'html' — for HTML content (typically body or params)
 *   - 'url' — for URL content (query or params)
 *
 * @param {Object} [contextMap={}] - Map specifying the context for each request source.
 * @param {'html'|'url'} [contextMap.body] - Context for req.body.
 * @param {'html'|'url'} [contextMap.query] - Context for req.query.
 * @param {'html'|'url'} [contextMap.params] - Context for req.params.
 *
 * @returns {Function} Express middleware function
 *
 * @example
 * // Apply middleware globally to all routes
 * app.use(sanitizeRequest({
 *   body: 'html',    // escape HTML in body
 *   query: 'url',    // escape URL in query
 *   params: 'url'    // escape URL in params
 * }));
 *
 * // If contextMap is not provided:
 * // - body defaults to 'html'
 * // - query and params default to 'url'
 */
export const sanitizeRequest =
  (contextMap = {}) =>
  (req, res, next) => {
    try {
      ['body', 'query', 'params'].forEach(source => {
        if (!req[source]) return;

        let context = contextMap[source];
        if (!context) {
          if (source === 'body') {
            context = 'html'; // body ->  HTML
          } else {
            context = 'url'; // query та params -> URL
          }
        }

        Object.assign(req[source], sanitizeObject(req[source], context));
      });

      next();
    } catch (err) {
      next(err);
    }
  };

export default sanitizeRequest;
