import * as services from '../services/shopsServices.js';

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
  res.status(201).
    json({
      status: 201,
      message: 'Shop was created successfully',
      data,
    });
};
