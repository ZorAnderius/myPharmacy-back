import createHttpError from 'http-errors';
import { DANGEROUS_QUERY_VALUES, DANGEROUS_SYMBOLS, DOUBLE_UNDERSCORE, sqlPattern, xssPattern } from '../../constants/queryDangerousValues.js';
import { MAX_STRING_LENGTH } from '../../constants/lifetimeVars.js';
import escapeByContext from './escape.js';
import { RAW_FIELDS } from '../../constants/EXTENSIONS.js';
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

/**
 * Validates whether a given object key name is safe for use.
 *
 * A "safe" key is:
 * - A string type.
 * - Not present in the `DANGEROUS_QUERY_VALUES` set (to block known attack vectors).
 * - Not matching the `DANGEROUS_SYMBOLS` regex (e.g., special characters).
 * - Not matching the `DOUBLE_UNDERSCORE` regex (to prevent prototype pollution via `__proto__`, etc.).
 *
 * @function isSafeKey
 * @param {string} key - The object key to validate.
 * @returns {boolean} `true` if the key is safe, otherwise `false`.
 *
 * @example
 * isSafeKey("username");  // true
 * isSafeKey("__proto__"); // false
 * isSafeKey("$where");    // false
 */
export const isSafeKey = key => {
  if (typeof key !== 'string') return false;
  if (DANGEROUS_QUERY_VALUES.has(key)) return false;
  if (DANGEROUS_SYMBOLS.test(key)) return false;
  if (DOUBLE_UNDERSCORE.test(key)) return false;
  return true;
};

const truncateOrReject = str => {
  if (str.length > MAX_STRING_LENGTH) {
    throw createHttpError(400, 'Input string is too long');
  }
  return str;
};

/**
 * Recursively sanitizes an object by:
 * - Enforcing safe key names via `isSafeKey`.
 * - Escaping string values to prevent XSS via `escapeHTML`.
 * - Rejecting values containing dangerous query fragments (from `DANGEROUS_QUERY_VALUES`).
 * - Preventing circular references with a `WeakMap`.
 * - Limiting recursion depth to avoid excessively nested input.
 *
 * @function sanitizeObject
 * @param {Object|Array|string|number|boolean|null} obj - The object (or value) to sanitize.
 * @param {number} [depth=0] - Current recursion depth (internal use).
 * @param {WeakMap<object, object>} [seen=new WeakMap()] - Tracks already visited objects to prevent infinite loops.
 * @returns {Object|Array|string|number|boolean|null} - The sanitized object/value.
 *
 * @throws {Error} If object nesting exceeds 10 levels.
 * @throws {HttpError} If an unsafe key or value is detected.
 *
 * @example
 * const input = {
 *   username: "<script>alert('xss')</script>",
 *   nested: {
 *     badKey: "DROP TABLE users;"
 *   }
 * };
 *
 * const safe = sanitizeObject(input);
 * // => { username: "&lt;script&gt;alert('xss')&lt;/script&gt;", nested: { badKey: "DROP TABLE users;" } }
 */
export const sanitizeObject = (obj, context = 'html', depth = 0, seen = new WeakMap(), suspicious = [], req = null) => {
  if (depth > 10) {
    throw new Error('Object depth limit exceeded');
  }
  if (!obj || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);

  const safeObject = Array.isArray(obj) ? [] : {};
  seen.set(obj, safeObject);

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    if (!isSafeKey(key)) {
      throw createHttpError(400, `Unsafe key detected: ${key}`);
    }

    const value = obj[key];
    if (value && typeof value === 'object') {
      safeObject[key] = sanitizeObject(value, context, depth + 1, seen, suspicious, req);
    } else if (typeof value === 'string') {
      if (sqlPattern.test(value)) {
        suspicious.push({ key, value, type: 'SQLi' });
      }
      if (xssPattern.test(value)) {
        suspicious.push({ key, value, type: 'XSS' });
      }
      if (!RAW_FIELDS.includes(key)) {
        const safeString = truncateOrReject(escapeByContext(value, context));
        safeObject[key] = safeString;
      } else {
        safeObject[key] = value;
      }
    } else {
      safeObject[key] = value;
    }
  }

  if (depth === 0 && suspicious.length > 0) {
    const logInfo = {
      ip: req?.ip || 'unknown',
      userAgent: req?.headers?.['user-agent'] || 'unknown',
      url: req?.originalUrl || 'unknown',
      method: req?.method || 'unknown',
      userId: req?.user?.id || null,
      timestamp: new Date().toISOString(),
      suspicious,
    };
    console.warn(`${colors.red} Suspicious activity detected:${colors.reset}\n` + `${colors.cyan}${JSON.stringify(logInfo, null, 2)}${colors.reset}`);
  }

  return safeObject;
};
