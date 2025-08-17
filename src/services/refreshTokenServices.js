import sequelize from '../db/sequelize.js';
import RefreshToken from '../db/models/RefreshToken.js';
import User from '../db/models/User.js';
import { generateRefreshToken } from '../utils/tokenServices.js';
import { Op } from 'sequelize';

/**
 * Creates and persists a new refresh token record in the database.
 *
 * Stores metadata about the refresh token (user, JTI, expiration, IP, User-Agent)
 * and its hashed value for secure validation later.
 *
 * @async
 * @param {Object} params - Parameters for creating the refresh token.
 * @param {string} params.user_id - The UUID of the user the token belongs to.
 * @param {string} params.jti - Unique identifier (JWT ID) of the refresh token.
 * @param {Date} params.expires_at - The expiration date of the refresh token.
 * @param {string} [params.ip] - The IP address where the token was issued.
 * @param {string} [params.user_agent] - The User-Agent string of the client.
 * @param {string} params.token_hash - Hashed version of the refresh token (bcrypt).
 * @returns {Promise<void>} Resolves when the refresh token is successfully stored.
 * @throws {Error} If database insertion fails.
 */
export const createRefreshToken = async ({ user_id, jti, expires_at, ip, user_agent, token_hash }, options = {}) => {
  return await RefreshToken.create(
    {
      user_id,
      jti,
      expires_at,
      ip,
      user_agent,
      token_hash,
    },
    { ...options }
  );
};

/**
 * Creates a new refresh token and revokes all previous ones
 * for the given user, IP, and user-agent.
 *
 * This operation is executed within a transaction to ensure atomicity:
 * - A new refresh token is created.
 * - All existing refresh tokens with the same user_id, ip, and user_agent
 *   that are not yet revoked will be marked as revoked = true
 *   and updated with replaced_by = jti of the newly created token.
 *
 * @async
 * @function createAndRevokeOldRefreshTokens
 * @param {Object} query - Parameters for creating the refresh token.
 * @param {string} query.user_id - The user ID associated with the token.
 * @param {string} query.ip - The client’s IP address.
 * @param {string} query.user_agent - The client’s user-agent string.
 * @returns {Promise<RefreshToken>} The newly created refresh token.
 *
 * @throws {Error} If the transaction or token creation fails.
 */
export const createAndRevokeOldRefreshTokens = async query => {
  return await sequelize.transaction(async t => {
    const newToken = await createRefreshToken(query, { transaction: t });
    await RefreshToken.update(
      {
        revoked: true,
        replaced_by: newToken.jti,
      },
      {
        where: {
          user_id: query.user_id,
          ip: query.ip,
          user_agent: query.user_agent,
          revoked: false,
          jti: { [Op.ne]: newToken.jti },
        },
        transaction: t,
      }
    );
    return newToken;
  });
};

/**
 * Retrieves a refresh token record from the database by its JTI (JWT ID).
 *
 * @async
 * @param {string} jti - The unique identifier (JWT ID) of the refresh token.
 * @returns {Promise<RefreshToken|null>} The refresh token record if found, otherwise null.
 * @throws {Error} If a database query error occurs.
 */
export const getRefreshToken = async query => {
  const token = await RefreshToken.findOne({ where: query });
  return token;
};

/**
 * Retrieves a refresh token along with the associated user from the database.
 * The query can include any combination of token fields (e.g., jti, user_id, ip, user_agent).
 *
 * @async
 * @param {Object} query - The search criteria for the refresh token.
 * @param {string} [query.jti] - The JWT ID of the refresh token.
 * @param {number} [query.user_id] - The ID of the user who owns the token.
 * @param {string} [query.ip] - The IP address from which the token was issued.
 * @param {string} [query.user_agent] - The user agent string associated with the token.
 * @returns {Promise<RefreshToken|null>} The refresh token record with the related user if found, otherwise null.
 * @throws {Error} If the database query fails.
 */
export const getRefreshTokenAndUser = async query => {
  const where = {
    revoked: false,
    ...query,
  };
  const data = await RefreshToken.findOne({
    where,
    include: [
      {
        model: User,
        attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber', 'avatarUrl'],
      },
    ],
  });
  return data;
};

/**
 * Rotates a refresh token if it is older than one day.
 *
 * This function checks the age of the provided refresh token (by its JTI),
 * and if it is older than one day, it generates a new refresh token and marks
 * the old one as revoked. Otherwise, it returns the existing token.
 *
 * @async
 * @param {string} params.jti - The JWT ID of the refresh token to check.
 * @returns {Promise<RefreshToken>} Returns the current refresh token or the newly generated one if rotation occurred.
 *
 * @throws {Error} Throws a 404 error if the token is not found.
 */
export const refreshTokenRotation = async jti => {
  const token = await getRefreshToken({ jti });
  if (!token) throw createHttpError(404, 'Refresh token not found');

  const now = new Date();
  const tokenAges = now - token.createdAt;
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (tokenAges > oneDayMs) {
    const newToken = await generateRefreshToken(token);
    return newToken;
  }
  return token;
};
