import createHttpError from 'http-errors';
import Category from '../db/models/Category.js';
import Product from '../db/models/Product.js';
import countPaginationQuery from '../utils/pagination/countPaginationQuery.js';
import sequelize from '../db/sequelize.js';
import saveToCloudinary from '../utils/saveToClaudinary.js';
import Supplier from '../db/models/Supplier.js';
import Address from '../db/models/Address.js';
import ZipCode from '../db/models/ZipCode.js';
import Review from '../db/models/Review.js';
import { defaultPagination, defaultPaginationReview } from '../constants/defaultPagination.js';
import User from '../db/models/User.js';
import updateObjects from '../utils/updateObjects.js';
import { PRODUCT_IMAGE_FOLDER } from '../constants/cloudinary.js';

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

export const getFullProductInfo = async query => {
  const product = await Product.findOne({
    where: query,
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name'] },
      {
        model: Supplier,
        as: 'shop',
        attributes: ['name', 'phone', 'email'],
        include: [
          {
            model: Address,
            as: 'address',
            attributes: ['street', 'apartment'],
            include: [{ model: ZipCode, as: 'zipCode', attributes: ['city', 'code'] }],
          },
        ],
      },
    ],
  });
  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  return product;
};

export const getProductReview = async ({ pagination: { page = defaultPaginationReview.page, limit = defaultPaginationReview.limit } }, ...query) => {
  const offset = (page - 1) * limit;
  const product = await findProduct(query);
  if (!product) throw createHttpError(404, 'Product not found');
  const { count, rows: reviews } = await Review.findAndCountAll({
    where: { product_id: query.id },
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'avatarUrl'] }],
    offset,
    limit,
    order: [['createAt', 'DESC']],
  });
  const paginationValues = countPaginationQuery(count, page, limit);
  if (page > paginationValues.totalPages || page < 1) throw createHttpError(400, 'Page is out of range');
  return reviews?.length > 0
    ? {
        product,
        reviews: {
          data: reviews,
          ...paginationValues,
        },
      }
    : {
        product,
        reviews: { data: reviews },
      };
};

export const updateProduct = async ({ query, data, file = '', folderName = PRODUCT_IMAGE_FOLDER }) => {
  return sequelize.transaction(async t => {
    const product = await findProduct(query, { transaction: t });
    if (!product) throw createHttpError(404, 'Product not found');
    const updatedData = updateObjects(data);
    let image_url = '';
    try {
      if (file) image_url = await saveToCloudinary(file, folderName);
    } catch (error) {
      throw createHttpError(500, 'Failed to save product image');
    }
    if (image_url) updatedData.image_url = image_url;
    const updatedProduct = await product.update({ ...updatedData }, { returning: true, transaction: t });
    return updatedProduct;
  });
};
