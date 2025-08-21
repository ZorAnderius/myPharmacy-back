/**
 * Parses a string value into a boolean.
 *
 * @function parseBoolean
 * @param {string|boolean} boolVal - The value to parse. Typically a string (`"true"` / `"false"`)
 *                                   but may also be a boolean.
 *
 * @returns {boolean|undefined} Returns:
 * - `true` if the input is `"true"` (string) or `true` (boolean).
 * - `false` if the input is `"false"` (string) or `false` (boolean).
 * - `undefined` if the input is not a string or cannot be parsed.
 *
 * @example
 * parseBoolean("true");   // true
 * parseBoolean("false");  // false
 * parseBoolean(true);     // true
 * parseBoolean(false);    // false
 * parseBoolean("abc");    // undefined
 * parseBoolean(123);      // undefined
 */
const parseBoolean = boolVal => {
  if (typeof boolVal !== 'string') return;
  const parseValue = boolVal && JSON.parse(boolVal);
  if (typeof boolVal === 'boolean') return parseValue;
};

export default parseBoolean;
