import RefreshToken from '../db/models/RefreshToken.js';

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
export const getRefreshToken = async jti => {
  const token = await RefreshToken.findOne({ where: { jti } });
  return token;
};
