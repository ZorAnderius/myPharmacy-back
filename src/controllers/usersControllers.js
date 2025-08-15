import * as service from '../services/usersServices.js';

/**
 * Controller for registering a new user.
 * Calls the `register` service with the request body and returns the created user.
 *
 * @param {import('express').Request} req - Express request object, expects user data in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} - Sends JSON response with status 201 and user data.
 */
export const registerController = async (req, res, next) => {
  const userDate = req.body;
  const result = await service.register(userDate);
  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: result,
  });
};

/**
 * Controller for user login.
 * Calls the `login` service with email and password from request body and returns the authenticated user.
 *
 * @param {import('express').Request} req - Express request object, expects `email` and `password` in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} - Sends JSON response with status 200 and user data if login is successful.
 */
export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await service.login({ email, password });
  res.json({
    status: 200,
    message: 'Login successful',
    data: result,
  });
};
