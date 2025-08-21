/**
 * Safely parses a string into a number, falling back to a default if invalid.
 *
 * @function parseNumber
 * @param {string|number} num - The value to parse. Only strings are parsed;
 *                              non-string values will return the default.
 * @param {number} defNum - The default number to return if parsing fails.
 *
 * @returns {number} A valid number. If `num` is not a string or cannot be parsed into a number, returns `defNum`.
 *
 * @example
 * parseNumber("42", 0);      // 42
 * parseNumber("abc", 10);    // 10  (invalid string → default)
 * parseNumber(99, 5);        // 5   (non-string → default)
 * parseNumber(undefined, 1); // 1   (non-string → default)
 */
const parseNumber = (num, defNum) => {
  if (typeof num !== 'string') return defNum;
  return isNaN(Number(num)) ? defNum : Number(num);
};

export default parseNumber;
