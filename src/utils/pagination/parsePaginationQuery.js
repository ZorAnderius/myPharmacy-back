import defaultPagination from '../../constants/defaultPagination.js';
import parseNumber from '../parseValues/parseNumber.js';

const parsePaginationQuery = query => {
  const { page, limit } = query;
  return {
    page: parseNumber(page, defaultPagination.page),
    limit: parseNumber(limit, defaultPagination.limit),
  };
};

export default parsePaginationQuery;
