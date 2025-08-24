import UpdateShopDTO from '../dto/updateShopDTO.js';
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

export const getAllMedicalShopsController = async (req, res, next) => {
  const pagination = parsePaginationQuery(req.query);
  const data = await services.getAllMedicalShopsController(pagination);
  res.json({
    status: 200,
    message: 'All medical shops retrieved successfully',
    data,
  });
};

export const getShopByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await services.getShopById({ id });
  res.json({
    status: 200,
    message: "Successfully found shop and it's additional information",
    data,
  });
};

export const updateShopController = async (req, res, next) => {
  const { id } = req.params;
  const dataDTO = new UpdateShopDTO(req.body);
  const data = await services.updateShop({ query: { id }, data: dataDTO });
  res.status(200).json({
    status: 200,
    message: 'Shop was updated successfully.',
    data,
  });
};

export const getAllProductsByShopIdController = async (req, res, next) => {
  const { id } = req.params;
  const pagination = parsePaginationQuery(req.query);
  const filter = parseFilterQuery(parseFilterQuery.query);
  const data = await services.getAllProductsByShopId({ supplier_id: id, pagination, filter });
  res.json({
    status: 200,
    message: 'Products list by shop retrieved successfully.',
    data,
  });
};
