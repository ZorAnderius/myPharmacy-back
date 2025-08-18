import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import User from '../db/models/User.js';
import createHttpError from 'http-errors';
import { generateTokens } from '../utils/tokenServices.js';
import { getRefreshToken } from './refreshTokenServices.js';
import { validateCode } from '../utils/googleOAuth.js';
import saveToCloudinary from '../utils/saveToClaudinary.js';

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
  const { accessToken, refreshToken } = await generateTokens({
    id: user.id,
    email: user.email,
    ip,
    userAgent,
  });
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

/**
 * Authenticates or registers a user via Google OAuth2.
 *
 * - Validates the provided authorization code with Google.
 * - If the user exists, retrieves them from the database.
 * - If the user does not exist, creates a new one with Google profile data.
 * - Generates access and refresh tokens for the session.
 *
 * @async
 * @function authenticateWithGoogleOAuth
 * @param {Object} params - The parameters object.
 * @param {string} params.code - The authorization code from Google OAuth2.
 * @param {string} params.ip - The client's IP address.
 * @param {string} params.userAgent - The client's User-Agent string.
 * @returns {Promise<Object>} An object containing the authenticated user and issued tokens.
 * @returns {Object} return.user - The user object.
 * @returns {string} return.user.id - The user's ID.
 * @returns {string} return.user.firstName - The user's first name.
 * @returns {string} return.user.lastName - The user's last name.
 * @returns {string} return.user.email - The user's email.
 * @returns {string|null} return.user.phoneNumber - The user's phone number (if any).
 * @returns {string|null} return.user.avatarUrl - The user's Google profile picture.
 * @returns {string} return.accessToken - The generated access token.
 * @returns {string} return.refreshToken - The generated refresh token.
 *
 * @throws {import('http-errors').HttpError} 401 - If validation fails or payload is missing.
 *
 * @example
 * const { user, accessToken, refreshToken } = await authenticateWithGoogleOAuth({
 *   code: "4/0AVHE...",
 *   ip: "127.0.0.1",
 *   userAgent: "Mozilla/5.0"
 * });
 */
export const authenticateWithGoogleOAuth = async ({ code, ip, userAgent }) => {
  const authTicket = await validateCode(code);
  const { payload } = authTicket;
  if (!payload) throw createHttpError(401, 'Not authorized');
  let user = await getUser({ email: payload.email });
  if (!user) {
    const pas = randomBytes(10);
    const password = await bcrypt.hash(pas, 11);
    user = await User.create({
      email: payload.email,
      password,
      firstName: payload.given_name,
      lastName: payload.family_name,
      avatarUrl: payload.picture,
    });
  }
  const { accessToken, refreshToken } = await generateTokens({
    id: user.id,
    email: user.email,
    ip,
    userAgent,
  });

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

/**
 * Logs out a user by revoking their refresh token.
 *
 * @async
 * @param {Object} params - The parameters for logout.
 * @param {string|number} params.userId - The ID of the user requesting logout.
 * @param {string} params.jti - The JWT ID used to identify the refresh token.
 * @returns {Promise<void>} Resolves when the refresh token is successfully revoked.
 *
 * @throws {HttpError} 404 - If the refresh token is not found.
 * @throws {HttpError} 403 - If the refresh token does not belong to the provided user.
 */
export const logout = async ({ userId, jti }) => {
  const token = await getRefreshToken({ jti });
  if (!token) throw createHttpError(404, 'Refresh token not found');
  if (token.user_id !== userId) {
    throw createHttpError(403, 'Forbidden');
  }
  token.revoked = true;
  await token.save();
};

/**
 * Updates a user's avatar by uploading a new file to Cloudinary.
 *
 * @async
 * @function updateAvatar
 * @param {Object} params - Parameters for updating the avatar.
 * @param {number|string} params.id - ID of the user whose avatar will be updated.
 * @param {Object} params.file - File object to be uploaded (from multer).
 * @param {Buffer} params.file.buffer - File buffer.
 * @param {string} params.file.originalname - Original name of the file.
 * @param {string} [params.folderName] - Optional folder name in Cloudinary to store the avatar.
 *
 * @throws {HttpError} 400 - If no file is provided.
 * @throws {HttpError} 401 - If the user is not found or unauthorized.
 * @throws {HttpError} 500 - If the avatar upload or update fails.
 *
 * @returns {Promise<Object>} Returns an object containing the user's id and new avatar URL.
 * @returns {number|string} return.id - The user's ID.
 * @returns {string} return.avatarUrl - The updated avatar URL.
 */
export const updateAvatar = async ({ id, file, folderName }) => {
  if (!file) throw createHttpError(400, 'File is required');
  const user = await getUserById(id);
  if (!user) throw createHttpError(401, 'Not authorized');
  try {
    const avatarUrl = await saveToCloudinary(file, folderName);
    await user.update({ avatarUrl }, { returning: true });
    return {
      id: user.id,
      avatarUrl: user.avatarUrl,
    };
  } catch (error) {
    throw createHttpError(500, 'Failed to update avatar');
  }
};
