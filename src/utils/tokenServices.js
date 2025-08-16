import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import env from './envConfig.js';
import ENV_VARIABLES from '../constants/ENV_VARIABLES.js';
import createHttpError from 'http-errors';
import { createRefreshToken } from '../services/refreshTokenServices.js';

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
    { expiresIn: '1h' }
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
export const generateRefreshToken = async ({ id, ip, userAgent, previousToken = null }) => {
  const jti = uuidv4();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  if (previousToken) {
    previousToken.revoked = true;
    previousToken.replaced_by = jti;
    await previousToken.save();
  }
  const token = jwt.sign({ sub: id, jti }, refreshSecret, { expiresIn: '7d' });
  const hashedToken = await bcrypt.hash(token, 11);

  try {
    await createRefreshToken({
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
export const verifyRefreshToken = async refreshToken => {
  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const tokenRecord = await getRefreshToken(decoded.jti);
    if (!tokenRecord) throw createHttpError(401, 'Token not found');
    if (tokenRecord?.revoked) throw createHttpError(401, 'Refresh token has been revoked');
    if (new Date() > tokenRecord.expires_at) throw createHttpError(401, 'Refresh token has expired');

    const isMatch = await bcrypt.compare(refreshToken, tokenRecord.token_hash);
    if (!isMatch) throw createHttpError(401, 'Invalid refresh token');
    return decoded;
  } catch (error) {
    throw createHttpError(401, 'Invalid refresh token');
  }
};
