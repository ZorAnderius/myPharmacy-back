import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import env from './envConfig.js';
import ENV_VARIABLES from '../constants/ENV_VARIABLES.js';
import createHttpError from 'http-errors';
import { createAndRevokeOldRefreshTokens, getRefreshTokenAndUser } from '../services/refreshTokenServices.js';
import { MAX_AGE_ACCESS_TOKENS, MAX_AGE_REFRESH_TOKENS } from '../constants/lifetimeVars.js';

/**
 * JWT secrets for signing access and refresh tokens.
 * @constant {string}
 */
const accessSecret = env(ENV_VARIABLES.JWT_ACCESS_SECRET);
const refreshSecret = env(ENV_VARIABLES.JWT_REFRESH_SECRET);

/**
 * Generates a JWT access token for a user.
 *
 * @param {string} id - User ID.
 * @param {string} email - User email.
 * @returns {string} Signed JWT access token.
 */
export const generateAccessToken = (id, email) => {
  return jwt.sign(
    {
      sub: id,
      email: email,
    },
    accessSecret,
    { expiresIn: MAX_AGE_ACCESS_TOKENS }
  );
};

/**
 * Generates a new refresh token for a user, stores it in the database,
 * and optionally revokes the previous token.
 *
 * @async
 * @function generateRefreshToken
 * @param {Object} params - Parameters for generating the token.
 * @param {string} params.id - Unique identifier of the user (user_id).
 * @param {string} params.ip - IP address of the user making the request.
 * @param {string} params.userAgent - User-Agent string of the browser or client.
 * @param {Object|null} [params.previousToken=null] - The previous refresh token database record.
 * If provided, it will be marked as revoked (`revoked = true`)
 * and the `replaced_by` field will be set to the `jti` of the new token.
 *
 * @throws {HttpError} 500 - If an error occurs while creating the token record in the database.
 *
 * @returns {Promise<string>} Returns the newly generated refresh token as a signed JWT string.
 */
export const generateRefreshToken = async ({ id, ip, userAgent }) => {
  const jti = uuidv4();
  const expires = new Date();
  expires.setDate(expires.getDate() + MAX_AGE_REFRESH_TOKENS / (24 * 60 * 60)); // 1 days
  const token = jwt.sign({ sub: id, jti }, refreshSecret, { expiresIn: MAX_AGE_REFRESH_TOKENS });
  const hashedToken = await bcrypt.hash(token, 11);

  try {
    await createAndRevokeOldRefreshTokens({
      user_id: id,
      jti,
      expires_at: expires,
      ip,
      user_agent: userAgent,
      token_hash: hashedToken,
    });
  } catch (error) {
    throw createHttpError(500, 'Error creating refresh token');
  }

  return token;
};

/**
 * Generates a new pair of access and refresh tokens for a user.
 * The refresh token is stored in the database and may optionally revoke a previous one.
 *
 * @async
 * @function generateTokens
 * @param {Object} params - Parameters for token generation.
 * @param {string} params.id - Unique identifier of the user (user_id).
 * @param {string} params.email - Email address of the user (used in the access token payload).
 * @param {string} params.ip - IP address of the user making the request.
 * @param {string} params.userAgent - User-Agent string of the browser or client.
 * @param {Object|null} [params.previousToken=null] - Previous refresh token database record.
 * If provided, it will be marked as revoked and linked to the new token via `replaced_by`.
 *
 * @returns {Promise<Object>} An object containing:
 *  - {string} accessToken - Short-lived JWT for authenticating requests.
 *  - {string} refreshToken - Long-lived JWT for refreshing sessions.
 */
export const generateTokens = async ({ id, email, ip, userAgent, previousToken = null }) => {
  const accessToken = generateAccessToken(id, email);
  const refreshToken = await generateRefreshToken({ id, ip, userAgent, previousToken });
  return { accessToken, refreshToken };
};

/**
 * Verifies a JWT access token and returns its decoded payload.
 *
 * @param {string} token - The JWT access token to verify.
 * @returns {Object|null} Returns the decoded token payload if valid, otherwise `null` if the token is expired or invalid.
 *
 * @throws {Error} Throws an HTTP 401 error if the token verification fails for reasons other than expiration or invalid format.
 */
export const verifyAccessToken = token => {
  try {
    const decoded = jwt.verify(token, accessSecret);
    return decoded;
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return null;
    }
    throw createHttpError(401, 'Invalid access token');
  }
};

/**
 * Verifies the validity of a refresh token.
 *
 * This function:
 *  - Decodes and verifies the JWT signature and expiration.
 *  - Fetches the token record from the database by its JTI.
 *  - Ensures the token exists, has not been revoked, and has not expired.
 *  - Compares the provided token against the stored hashed token for extra security.
 *
 * @async
 * @param {string} refreshToken - The raw refresh token provided by the client.
 * @returns {Promise<Object>} The decoded JWT payload if the token is valid.
 * @throws {import('http-errors').HttpError} 401 error if the token is invalid, expired, revoked, or not found.
 */
export const verifyRefreshToken = async (refreshToken, query = {}) => {
  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const token = await getRefreshTokenAndUser({ jti: decoded.jti, user_id: decoded.sub, ...query });
    if (!token) throw createHttpError(401, 'Token not found');
    if (token.revoked) throw createHttpError(401, 'Refresh token has been revoked');
    if (new Date() > token.expires_at) throw createHttpError(401, 'Refresh token has expired');

    const isMatch = await bcrypt.compare(refreshToken, token.token_hash);
    if (!isMatch) throw createHttpError(401, 'Invalid refresh token');
    return { payload: decoded, user: token.User, revoked: token.revoked };
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

/**
 * Extracts the `jti` (JWT ID) claim from a given refresh token.
 *
 * @param {string} token - The JSON Web Token (JWT) string to verify and decode.
 * @returns {string} The `jti` value contained in the verified token.
 * @throws {Error} If the token is invalid, expired, or cannot be verified using the `refreshSecret`.
 */
export const getJTI = token => {
  const decoded = jwt.verify(token, refreshSecret);
  return decoded.jti;
};
