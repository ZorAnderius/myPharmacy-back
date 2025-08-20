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