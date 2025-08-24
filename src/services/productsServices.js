import createHttpError from 'http-errors';
import defaultPagination from '../constants/defaultPagination.js';
import Category from '../db/models/Category.js';
import Product from '../db/models/Product.js';
import countPaginationQuery from '../utils/pagination/countPaginationQuery.js';
import sequelize from '../db/sequelize.js';
import saveToCloudinary from '../utils/saveToClaudinary.js';

export const findProduct = async (query, option = {}) => {
  return await Product.findOne({ where: query, option });
};

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

export const createNewProduct = async ({ supplier_id, name, description, price, quantity, catalog_id, status_id, file, folderName = 'products' }) => {
  return await sequelize.transaction(async t => {
    const existProduct = await findProduct(
      { name, supplier_id, catalog_id },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      }
    );
    if (existProduct) throw createHttpError(409, 'Product already created');
    let image_url = '';
    try {
      image_url = await saveToCloudinary(file, folderName);
    } catch (error) {
      throw createHttpError(500, 'Failed to save product image');
    }
    return Product.create(
      {
        name,
        description,
        price,
        quantity,
        image_url,
        supplier_id,
        catalog_id,
        status_id,
      },
      { transaction: t }
    );
  });
};
