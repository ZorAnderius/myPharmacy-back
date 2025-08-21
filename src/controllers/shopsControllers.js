import * as services from '../services/shopsServices.js';
import parseFilterQuery from '../utils/pagination/parseFilterQuery.js';
import parsePaginationQuery from '../utils/pagination/parsePaginationQuery.js';

/**
 * Controller to handle creating a new shop.
 *
 * Receives shop data from the request body, calls the service to create the shop,
 * and returns a success response with the created shop data.
 *
 * @async
 * @function createShopController
 * @param {import('express').Request} req - Express request object, expects shop data in `req.body`.
 * @param {import('express').Response} res - Express response object, used to send JSON response.
 * @param {import('express').NextFunction} next - Express next function, called for error handling.
 *
 * @returns {Promise<void>} Sends a JSON response with status 201 and the created shop data.
 */
export const createShopController = async (req, res, next) => {
  const data = await services.createShop(req.body);
  res.status(201).json({
    status: 201,
    message: 'Shop was created successfully',
    data,
  });
};

/**
 * Controller to retrieve all shops.
 *
 * @async
 * @function getAllShopsController
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with all shops.
 * 
 *  @example
 * // GET /shops?page=2&limit=10&username=john&category=electronics
 */
export const getAllShopsController = async (req, res, next) => {
  const pagination = parsePaginationQuery(req.query);
  const filter = parseFilterQuery(req.query);
  const result = await services.getAllShops({ pagination, filter });
  res.json({
    status: 200,
    message: 'Shops retrieved successfully',
    data: result,
  });
};
