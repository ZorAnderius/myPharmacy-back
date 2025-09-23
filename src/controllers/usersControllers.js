import createHttpError from 'http-errors';
import { refreshTokens } from '../services/refreshTokenServices.js';
import { generateAuthUrl } from '../utils/googleOAuth.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/setRefreshTokenCookie.js';
import { setCSRFTokenCookie, clearCSRFTokenCookie } from '../utils/setCRSFTokenCookie.js';
import * as service from '../services/usersServices.js';
import GoogleOAuthDTO from '../dto/user/GoogleOAuthDTO.js';
import LoginUserDTO from '../dto/user/LoginUserDTO.js';
import RegisterUserDRO from '../dto/user/registerUserDTO.js';

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
  const userData = new RegisterUserDRO(req.body);
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  const { user, tokens } = await service.register({ userData, ip, userAgent });
  setRefreshTokenCookie(res, tokens.refreshToken);
  setCSRFTokenCookie(res, tokens.csrfToken);
  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: {
      user,
      accessToken: tokens.accessToken,
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
  const userData = new LoginUserDTO(req.body);
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  const tokens = await service.login({ userData, ip, userAgent });
  setRefreshTokenCookie(res, tokens.refreshToken);
  setCSRFTokenCookie(res, tokens.csrfToken);
  res.json({
    status: 200,
    message: 'Login successful',
    data: {
      user,
      accessToken: tokens.accessToken,
    },
  });
};

/**
 * Express controller for handling Google OAuth2 authentication.
 *
 * Accepts an authorization code from the client, exchanges it for tokens,
 * authenticates/creates the user, and responds with the user data plus access token.
 * A refresh token is stored in a secure HTTP-only cookie.
 *
 * @async
 * @function authenticateWithGoogleOAuthController
 * @param {import('express').Request} req - The Express request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.code - The authorization code returned from Google OAuth2.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with user data and access token.
 *
 * @example
 * // Client request:
 * POST /api/auth/google
 * {
 *   "code": "4/0AVHE...xyz"
 * }
 */
export const authenticateWithGoogleOAuthController = async (req, res, next) => {
  const { code } = new GoogleOAuthDTO(req.body);
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  const tokens = await service.authenticateWithGoogleOAuth({ code, ip, userAgent });
  setRefreshTokenCookie(res, tokens.refreshToken);
  setCSRFTokenCookie(res, tokens.csrfToken);
  res.json({
    status: 200,
    message: 'Google OAuth authentication successful',
    data: {
      user,
      accessToken: tokens.accessToken,
    },
  });
};

/**
 * Express controller for handling user logout.
 *
 * Extracts the user ID from the authenticated request, verifies the provided
 * refresh token, and revokes it via the logout service.
 *
 * @async
 * @function logoutController
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with logout status.
 *
 * @throws {Error} If the refresh token is invalid or logout fails in the service.
 */
export const logoutController = async (req, res, next) => {
  const userId = req.user.id;
  const jti = req.jti;
  await service.logout({ userId, jti });
  clearRefreshTokenCookie(res);
  clearCSRFTokenCookie(res);
  res.status(204).send();
};

/**
 * Express controller for retrieving the currently authenticated user.
 *
 * Uses the `userId` from `req.user` (set during authentication middleware) to fetch
 * the user from the database. If found, returns user details along with the access token.
 *
 * @async
 * @function currentUserController
 * @param {import('express').Request} req - Express request object.
 *   Requires `req.user.id` and optionally `req.accessToken`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response containing the user data and access token.
 *
 * @throws {HttpError} 404 - If the user cannot be found in the database.
 */
export const currentUserController = async (req, res, next) => {
  const userId = req.user.id;
  const user = await service.getUserById(userId);
  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }
  res.json({
    status: 200,
    message: 'Current user retrieved successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
      },
      accessToken: req.accessToken,
    },
  });
};

/**
 * Express controller that responds with a Google OAuth2 authentication URL.
 *
 * This endpoint generates a URL that the client can use to authenticate with Google.
 *
 * @function userGoogleOAuthController
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const userGoogleOAuthController = (req, res) => {
  const url = generateAuthUrl();
  res.json({
    message: 'Successfully requested OAuth URL',
    data: { url },
  });
};

/**
 * Controller to update a user's avatar.
 *
 * Handles the HTTP request to upload a new avatar file, sends it to Cloudinary,
 * updates the user's avatar URL in the database, and returns the updated information.
 *
 * @async
 * @function updateAvatarController
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.user - Authenticated user data injected by auth middleware.
 * @param {number|string} req.user.id - ID of the authenticated user.
 * @param {import('express').Express.Multer.File} req.file - Uploaded avatar file (from multer).
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function for error handling.
 *
 * @returns {Promise<void>} Sends a JSON response with status, message, and updated avatar data.
 * @throws Will forward any errors from the updateAvatar service to the next middleware.
 */
export const updateAvatarController = async (req, res, next) => {
  const { id } = req.user;
  const data = await service.updateAvatar({ id, file: req.file, folderName: 'pharmacyAvatars' });
  res.json({
    status: 200,
    message: 'Avatar updated successfully',
    data,
  });
};

export const refreshTokensController = async (req, res, next) => {
  const { refreshToken: cookieToken } = req.cookies || {};
  if (!cookieToken) {
    throw createHttpError(401, 'No refresh token provided');
  }
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  const { user, tokens } = await refreshTokens({ cookieToken, ip, userAgent });
  setRefreshTokenCookie(res, tokens.refreshToken);
  res.json({
    status: 200,
    message: 'Refresh token was syccessfully retrived',
    data: {
      user,
      accessToken: tokens.accessToken,
    },
  });
};
