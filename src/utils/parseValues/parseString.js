/**
 * Safely parses a string by trimming whitespace.
 *
 * @function parseString
 * @param {string} str - The value to parse.
 *
 * @returns {string|undefined} The trimmed string if valid and non-empty,
 *                             otherwise `undefined`.
 *
 * @example
 * parseString("  hello  "); // "hello"
 * parseString("");          // undefined
 * parseString(123);         // undefined
 * parseString(null);        // undefined
 */
const parseString = str => {
    if (typeof str !== "string") return;
    if (str?.length > 0) return str.trim();
}

export default parseString;