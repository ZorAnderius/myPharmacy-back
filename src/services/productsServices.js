import createHttpError from 'http-errors';
import defaultPagination from '../constants/defaultPagination.js';
import Category from '../db/models/Category.js';
import Product from '../db/models/Product.js';
import countPaginationQuery from '../utils/pagination/countPaginationQuery.js';

export const getAllProductsByShopId = async ({ pagination: { page = defaultPagination.page, limit = defaultPagination.limit }, filter, ...restQuery }) => {
  const offset = (page - 1) * limit;
  const query = { ...restQuery, ...filter };
  const { count, rows: products } = await Product.findAndCountAll({
    where: query,
    include: [{ model: Category, attributes: ['id', 'name'] }],
    offset,
    limit,
  });

  const paginationValues = countPaginationQuery(count, page, limit);
  if (page > paginationValues.totalPages || page < 1) throw createHttpError(400, 'Page is out of range');
  return products?.length > 0
    ? {
        products,
        ...paginationValues,
      }
    : products;
};
