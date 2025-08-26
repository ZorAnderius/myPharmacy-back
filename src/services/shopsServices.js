import createHttpError from 'http-errors';
import sequelize from '../db/sequelize.js';
import Supplier from '../db/models/Supplier.js';
import Address from '../db/models/Address.js';
import ZipCode from '../db/models/ZipCode.js';
import Category from '../db/models/Category.js';
import updateObjects from '../utils/updateObjects.js';
import countPaginationQuery from '../utils/pagination/countPaginationQuery.js';
import { defaultPagination } from '../constants/defaultPagination.js';
import { createNewAddress, updateAddress } from './addressServices.js';
import { createZipCode } from './zipCodeServices.js';

/**
 * Finds a single shop (Supplier) matching the given query.
 *
 * @param {Object} query - The search criteria for finding the shop.
 * @param {Object} [option] - Optional Sequelize options (e.g., transaction, include).
 * @returns {Promise<Object|null>} The found shop object or null if not found.
 */
export const findShop = async (query, option) => {
  return await Supplier.findOne({ where: query, ...option });
};

/**
 * Creates a new shop (Supplier) along with its address and zip code inside a database transaction.
 * If a shop with the same name, phone, and email already exists, throws a 409 conflict error.
 *
 * @param {Object} params - The shop creation parameters.
 * @param {string} params.name - The name of the shop.
 * @param {string} params.ownerName - The full name of the shop owner.
 * @param {string} params.phone - The shop's phone number.
 * @param {string} params.email - The shop's email address.
 * @param {string} params.street - The street address for the shop.
 * @param {string} params.city - The city of the shop's address.
 * @param {string} params.apartment - The apartment/suite number for the shop.
 * @param {string} params.zipCode - The postal code of the shop's address.
 * @param {boolean} params.hasDelivery - Whether the shop offers delivery.
 *
 * @throws {Error} Throws a 409 error if the shop already exists.
 * @throws {Error} Throws a 500 error if creation fails.
 *
 * @returns {Promise<Object>} The newly created shop record.
 */
export const createShop = async ({ name, ownerName, phone, email, street, city, apartment, code, hasDelivery }) => {
  return await sequelize.transaction(async t => {
    const options = { transaction: t };

    const zipCodeId = await createZipCode({ code, city }, options);
    const addressId = await createNewAddress({ street, apartment, zipCodeId }, options);
    const existsShop = await findShop({ name, phone, email }, options);
    if (existsShop) throw createHttpError(409, 'Shop already exists');
    return await Supplier.create(
      {
        name,
        ownerName,
        phone,
        email,
        address_id: addressId,
        has_delivery: hasDelivery,
      },
      options
    );
  });
};

/**
 * Fetches all shops with pagination and filtering.
 *
 * @async
 * @function getAllShops
 * @param {Object} params - The query parameters.
 * @param {Object} params.pagination - Pagination options.
 * @param {number} [params.pagination.page=defaultPagination.page] - Current page number (1-based).
 * @param {number} [params.pagination.limit=defaultPagination.limit] - Number of items per page.
 * @param {Object} [params.filter] - Filtering conditions applied to the query.
 * @param {Object} [restQuery] - Additional query conditions.
 *
 * @returns {Promise<Object|Array>} Returns a paginated response:
 * - If shops are found:
 *   ```js
 *   {
 *     shops: Array<Object>, // List of shops
 *     total: number,        // Total number of shops
 *     totalPages: number,   // Total number of pages
 *     currentPage: number,  // Current page number
 *     limit: number         // Page size
 *   }
 *   ```
 * - If no shops are found: an empty array.
 *
 * @throws {HttpError} Will throw a `400 Bad Request` error if the requested page is out of range.
 */
export const getAllShops = async ({ pagination: { page = defaultPagination.page, limit = defaultPagination.limit }, query={} }) => {
  const offset = (page - 1) * limit;
  const { count, rows: shops } = await Supplier.findAndCountAll({
    where: query,
    offset,
    limit,
  });

  const paginationValues = countPaginationQuery(count, page, limit);
  if (page > paginationValues.totalPages || page < 1) throw createHttpError(400, 'Page is out of range');
  return shops?.length > 0
    ? {
        shops,
        ...paginationValues,
      }
    : shops;
};

export const getShopById = async ({ id, ...options }) => {
  const include = [
    {
      model: Address,
      include: [
        {
          model: ZipCode,
          as: 'zipCode',
        },
      ],
    },
    {
      model: Product,
      include: {
        model: Category,
        attributes: ['id', 'name'],
      },
    },
  ];

  const shop = await findShop({ id }, options);
  return {
    id: shop.id,
    title: shop.name,
    owner: shop.ownerName,
    phone: shop.phone,
    email: shop.email,
    address: {
      street: shop.Address.street,
      apartment: shop.Address.apartment,
      zipCode: shop.Address.zipCode.code,
      city: shop.Address.zipCode.city,
      region: shop.Address.zipCode.region,
      country: shop.Address.zipCode.country,
    },
    products: shop.Products.map(product => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        image_url: product.image_url,
        category: product.Category ? { id: product.Category.id, name: product.Category.name } : null,
      };
    }),
  };
};

export const updateShop = async ({ query, data }) => {
  return await sequelize.transaction(async t => {
    const currentShop = await findShop(query, { transaction: t });
    if (!currentShop) throw createHttpError(404, 'Shop not found');

    const { street, apartment, code, city, ...shopData } = data;
    if (street || apartment || code || city) {
      await updateAddress(
        {
          id: currentShop.address_id,
          street,
          apartment,
          code,
          city,
        },
        { transaction: t }
      );
    }
    const updateData = updateObjects(shopData);
    await currentShop.update(updateData, { returning: true, transaction: t });
    return await findShop(
      { id: currentShop.id },
      {
        transaction: t,
        include: [{ model: Address, include: [ZipCode] }],
      }
    );
  });
};
