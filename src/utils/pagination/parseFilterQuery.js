import { categoryNames } from '../../constants/inputVars.js';
import parseString from '../parseValues/parseString.js';

/**
 * Parses and normalizes filter query parameters for searching.
 *
 * @function parseFilterQuery
 * @param {Object} query - The raw query object from the request.
 * @param {string} [query.username] - Optional username filter.
 * @param {string} [query.product] - Optional product name filter.
 * @param {string} [query.category] - Optional category filter.
 *
 * @returns {Object} A normalized filter object containing only valid filters.
 * @returns {string} [return.username] - Parsed username (if provided).
 * @returns {string} [return.product] - Parsed product name (if provided).
 * @returns {string} [return.category] - Parsed category (defaults to the first value in `categoryNames` if not provided).
 */
const parseFilterQuery = query => {
  let username = '';
  let productName = '';
  let category = categoryNames[0];
  const parseQuery = {};
  if (query.username) {
    const temp = parseString(query.username);
    username = temp ? temp : username;
    parseQuery.username = username;
  }
  if (query.product) {
    const temp = parseString(query.product);
    productName = temp ? temp : productName;
    parseQuery.product = productName;
  }
  if (query.category) {
    const temp = parseString(query.category);
    category = temp ? temp : category;
    parseQuery.category = category;
  }
  return parseQuery;
};

export default parseFilterQuery;
