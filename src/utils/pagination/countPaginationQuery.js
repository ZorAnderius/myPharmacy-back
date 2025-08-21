/**
 * Calculates pagination metadata based on total item count, current page, and page size.
 *
 * @function countPaginationQuery
 * @param {number} count - The total number of items in the dataset.
 * @param {number} page - The current page number (1-based).
 * @param {number} limit - The maximum number of items per page.
 *
 * @returns {Object} Pagination metadata.
 * @returns {number} return.page - The current page number.
 * @returns {number} return.limit - The maximum number of items per page.
 * @returns {number} return.totalItems - The total number of items.
 * @returns {number} return.totalPages - The total number of pages (at least `1`).
 * @returns {boolean} return.hasNextPage - Whether there is a next page.
 * @returns {boolean} return.hasPreviousPage - Whether there is a previous page.
 */
const countPaginationQuery = (count, page, limit) => {
  const totalPage = Math.ceil(count / limit);
  const hasNextPage = Boolean(totalPage - page) && totalPage - page > 0;
  const hasPreviousPage = page != 1 && page <= totalPage + 1;
  return {
    page: Number(page),
    limit: Number(limit),
    totalItems: count,
    totalPages: totalPage === 0 ? 1 : totalPage,
    hasNextPage,
    hasPreviousPage,
  };
};

export default countPaginationQuery;
