import { Op } from 'sequelize';
import RefreshToken from '../db/models/RefreshToken.js';
import User from '../db/models/User.js';

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
export const createRefreshToken = async ({ user_id, jti, expires_at, ip, user_agent, token_hash }) => {
  await RefreshToken.create({
    user_id,
    jti,
    expires_at,
    ip,
    user_agent,
    token_hash,
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
 * Retrieves a valid (not revoked and not expired) refresh token along with the associated user.
 *
 * @async
 * @function getRefreshTokenAndUser
 * @param {Object} params - Parameters for querying the refresh token.
 * @param {string} params.jti - The JWT ID of the refresh token.
 * @param {string} params.ip - The IP address from which the token was issued or used.
 * @param {string} params.user_agent - The user agent string associated with the token.
 * @param {string|number} params.user_id - The ID of the user who owns the token.
 * @returns {Promise<(Object|null)>} A refresh token record with an included `user` object if found, otherwise `null`.
 *
 * @throws {Error} If the database query fails.
 *
 * @usage
 * const tokenWithUser = await getRefreshTokenAndUser({
 *   jti: 'uuid-123',
 *   ip: '192.168.0.1',
 *   user_agent: 'Mozilla/5.0 ...',
 *   user_id: 1
 * });
 *
 * if (tokenWithUser) {
 *   console.log(tokenWithUser.user.email);
 * }
 */
export const getRefreshTokenAndUser = async ({ jti, ip, user_agent, user_id }) => { 
  const data = await RefreshToken.findOne({
    where: {
      jti,
      ip,
      user_agent,
      user_id,
      revoked: false,
      expires_at: { [Op.gt]: new Date() }
    },
    include: [{
      model: User,
      attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber', 'avatarUrl']
    }]
  });
  return data;
}

/**
 * Checks whether a refresh token with the given identifiers is still valid (not revoked and not expired).
 *
 * @async
 * @param {Object} params - The parameters for token lookup.
 * @param {string} params.jti - The JWT ID associated with the refresh token.
 * @param {string} params.ip - The IP address from which the token was issued or used.
 * @param {string} params.user_agent - The user agent string associated with the token.
 * @returns {Promise<Object|null>} The matching refresh token record if valid, otherwise `null`.
 *
 * @throws {Error} If the token lookup fails due to a database or query error.
 */
export const checkRevokedToken = async ({ jti, ip, user_agent, user_id }) => {
  return getRefreshTokenAndUser({
    jti,
    ip,
    user_agent,
    revoked: true,
    user_id,
    expires_at: { [Op.gt]: new Date() },
  });
};
