import morgan from 'morgan';

/**
 * Colors used for HTTP methods and URL in the custom Morgan log format.
 * @typedef {Object} Colors
 * @property {string} GET - Color code for GET requests (green).
 * @property {string} POST - Color code for POST requests (blue).
 * @property {string} PUT - Color code for PUT requests (yellow).
 * @property {string} DELETE - Color code for DELETE requests (red).
 * @property {string} RESET - Reset color code.
 * @property {string} URL - Color code for URLs (cyan).
 */
const colors = {
  GET: '\x1b[32m',
  POST: '\x1b[34m',
  PUT: '\x1b[33m',
  DELETE: '\x1b[31m',
  RESET: '\x1b[0m',
  URL: '\x1b[36m',
};

/**
 * Custom Morgan format called 'tiny-colored'.
 * Colors HTTP methods and URL for better console readability.
 *
 * @param {Object} tokens - Morgan tokens object.
 * @param {import('http').IncomingMessage} req - HTTP request object.
 * @param {import('http').ServerResponse} res - HTTP response object.
 * @returns {string} Formatted log string with colors for method, URL, status, and response time.
 *
 * @usage
 * app.use(morgan('tiny-colored'));
 */
morgan.format('tiny-colored', (tokens, req, res) => {
  const method = tokens.method(req, res);
  const color = colors[method] || colors.RESET;
  return `${color}${method} ${color.URL}${tokens.url(req, res)} ${color}${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms${colors.RESET};`;
});

export default morgan;
