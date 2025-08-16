import bcrypt from 'bcrypt';
import User from '../db/models/User.js';
import createHttpError from 'http-errors';
import { generateTokens } from '../utils/tokenServices.js';
import { Op } from 'sequelize';
import RefreshToken from '../db/models/RefreshToken.js';

/**
 * Finds a single user by the given query.
 * @param {Object} query - Query object for filtering the user (e.g., { email: string }).
 * @returns {Promise<Object|null>} - Returns the user object if found, otherwise null.
 */
export const getUser = async query => {
  const user = await User.findOne({ where: query });
  return user;
};

/**
 * Retrieves a user record by its primary key (ID).
 *
 * @async
 * @function getUserById
 * @param {string|number} id - The unique identifier of the user.
 * @returns {Promise<Object|null>} Resolves with the user object if found, or `null` if no user exists with the given ID.
 * @throws {Error} If the database query fails.
 */
export const getUserById = async id => {
  const user = await User.findByPk(id);
  return user;
};

/**
 * Registers a new user, stores their credentials in the database, and generates authentication tokens.
 *
 * @async
 * @function register
 * @param {Object} params - The parameters object.
 * @param {Object} params.userData - The registration data.
 * @param {string} params.userData.firstName - User's first name.
 * @param {string} params.userData.lastName - User's last name.
 * @param {string} params.userData.email - User's email address (must be unique).
 * @param {string} params.userData.password - User's plaintext password.
 * @param {string} params.userData.phoneNumber - User's phone number.
 * @param {string} params.ip - IP address of the client making the request.
 * @param {string} params.userAgent - User agent string of the client.
 *
 * @throws {HttpError} 400 - If any required field is missing.
 * @throws {HttpError} 409 - If the email is already registered.
 * @throws {HttpError} 500 - If user creation or token generation fails.
 *
 * @returns {Promise<Object>} An object containing:
 * @returns {Object} return.user - Public user information.
 * @returns {string} return.user.id - User's unique ID.
 * @returns {string} return.user.firstName - User's first name.
 * @returns {string} return.user.lastName - User's last name.
 * @returns {string} return.user.email - User's email address.
 * @returns {string} return.user.phoneNumber - User's phone number.
 * @returns {string} return.user.avatarUrl - User's avatar URL (empty if not set).
 * @returns {Object} return.tokens - JWT tokens for authentication.
 * @returns {string} return.tokens.accessToken - Short-lived JWT access token.
 * @returns {string} return.tokens.refreshToken - Long-lived JWT refresh token (stored in DB).
 */
export const register = async ({ userData, ip, userAgent }) => {
  const { firstName, lastName, email, password, phoneNumber } = userData;
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    throw createHttpError(400, 'All fields are required');
  }
  const existingUser = await getUser({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }
  const hashedPassword = password && (await bcrypt.hash(password, 11));
  const avatarUrl = '';
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    avatarUrl,
  });
  const { accessToken, refreshToken } = await generateTokens({ id: newUser.id, email: newUser.email, ip, userAgent });
  return {
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      avatarUrl: newUser.avatarUrl,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticates a user by validating credentials, generating JWT tokens, and returning user data.
 *
 * @async
 * @function login
 * @param {Object} params - The parameters object.
 * @param {Object} params.userData - The login credentials.
 * @param {string} params.userData.email - The user's email address.
 * @param {string} params.userData.password - The user's plaintext password.
 * @param {string} params.ip - The IP address of the client making the request.
 * @param {string} params.userAgent - The user agent string of the client.
 *
 * @throws {HttpError} 400 - If email or password is missing.
 * @throws {HttpError} 401 - If authentication fails due to invalid email or password.
 * @throws {HttpError} 500 - If token generation or database interaction fails.
 *
 * @returns {Promise<Object>} An object containing:
 * @returns {Object} return.user - Public user information (excluding sensitive fields).
 * @returns {string} return.user.id - User's unique ID.
 * @returns {string} return.user.firstName - User's first name.
 * @returns {string} return.user.lastName - User's last name.
 * @returns {string} return.user.email - User's email address.
 * @returns {string} [return.user.phoneNumber] - Optional user's phone number.
 * @returns {string} [return.user.avatarUrl] - Optional URL to the user's avatar.
 * @returns {Object} return.tokens - JWT tokens for authentication.
 * @returns {string} return.tokens.accessToken - Short-lived JWT access token.
 * @returns {string} return.tokens.refreshToken - Long-lived JWT refresh token (stored in DB).
 */
export const login = async ({ userData, ip, userAgent }) => {
  const { email, password } = userData;
  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required');
  }
  const user = await getUser({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const dbRefreshToken = await RefreshToken.findOne({
    where: {
      user_id: user.id,
      ip,
      user_agent: userAgent,
      revoked: false,
      expires_at: { [Op.gt]: new Date() },
    },
  });

  const { accessToken, refreshToken } = await generateTokens({ id: user.id, email: user.email, ip, userAgent, previousToken: dbRefreshToken });
  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
    },
    accessToken,
    refreshToken,
  };
};
