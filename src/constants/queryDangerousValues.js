/**
 * A set of string values considered dangerous in query parameters, object keys,
 * or other user-provided data. Using these values can lead to security issues
 * such as prototype pollution, code injection, or accidental override of
 * built-in object methods.
 *
 * @constant
 * @type {Set<string>}
 *
 * @example
 * if (DANGEROUS_QUERY_VALUES.has(key)) {
 *   throw new Error(`Unsafe key detected: ${key}`);
 * }
 */
export const DANGEROUS_QUERY_VALUES = new Set([
  '__proto__',
  'prototype',
  'constructor',
  'constructor.prototype',
  'prototype.constructor',
  'Object.prototype',
  'Object.prototype.constructor',
  'Object.prototype.__proto__',
  'eval',
  'arguments',
  'caller',
  'callee',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'toStringTag',
  'valueOf',
  'toJSON',
  'toLocaleString',
  'toPrimitive',
  'Symbol.toPrimitive',
  'Symbol.asyncIterator',
  'Symbol.hasInstance',
  'Symbol.isConcatSpreadable',
  'Symbol.match',
  'Symbol.replace',
  'Symbol.search',
  'Symbol.split',
  'Symbol.toStringTag',
  'Symbol.unscopables',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  'watch',
  'unwatch',
  'toSource',
  '__parent__',
  '__count__',
  '__lookup__',
]);

/**
 * Regular expression matching characters that are considered unsafe in keys:
 * dots, square brackets, or parentheses, which could enable object traversal
 * attacks.
 *
 * @constant
 * @type {RegExp}
 */
export const DANGEROUS_SYMBOLS = /[.[\]()]/;

/**
 * Regular expression that matches double underscores (`__`) in keys,
 * often used in prototype pollution attacks.
 *
 * @constant
 * @type {RegExp}
 */
export const DOUBLE_UNDERSCORE = /__/;

export const sqlPattern = /\b(SELECT|DROP|INSERT|UPDATE|DELETE)\b/i;
export const xssPattern = /<script\b/i;
