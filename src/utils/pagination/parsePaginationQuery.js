import defaultPagination from '../../constants/defaultPagination.js';
import parseNumber from '../parseValues/parseNumber.js';

/**
 * Parses pagination query parameters and applies defaults if values are invalid or missing.
 *
 * @function parsePaginationQuery
 * @param {Object} query - The raw query object from the request.
 * @param {string|number} [query.page] - The requested page number (1-based).
 * @param {string|number} [query.limit] - The maximum number of items per page.
 *
 * @returns {Object} Normalized pagination values.
 * @returns {number} return.page - The parsed page number (defaults to `defaultPagination.page` if not provided or invalid).
 * @returns {number} return.limit - The parsed page size (defaults to `defaultPagination.limit` if not provided or invalid).
 */
const parsePaginationQuery = query => {
  const { page, limit } = query;
  return {
    page: parseNumber(page, defaultPagination.page),
    limit: parseNumber(limit, defaultPagination.limit),
  };
};

export default parsePaginationQuery;
