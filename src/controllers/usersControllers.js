import * as service from '../services/usersServices.js';
import setRefreshTokenCookie from '../utils/setRefreshTokenCookie.js';

/**
 * Controller for registering a new user.
 * Calls the `register` service with the request body and returns the created user.
 *
 * @param {import('express').Request} req - Express request object, expects user data in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} - Sends JSON response with status 201 and user data and tokens.
 */
export const registerController = async (req, res, next) => {
  const userData = req.body;
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  const { user, accessToken, refreshToken } = await service.register({ userData, ip, userAgent });
  setRefreshTokenCookie(res, refreshToken);
  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: {
      user,
      accessToken,
    },
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
  const userData = req.body;
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  const { user, accessToken, refreshToken } = await service.login({ userData, ip, userAgent });
  setRefreshTokenCookie(res, refreshToken);
  res.json({
    status: 200,
    message: 'Login successful',
    data: {
      user,
      accessToken,
    },
  });
};
