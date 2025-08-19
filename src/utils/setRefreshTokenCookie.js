import ENV_VARIABLES from '../constants/ENV_VARIABLES.js';
import { MAX_AGE_REFRESH_TOKENS, REFRESH_TOKEN_COOKIE } from '../constants/lifetimeVars.js';
import env from './envConfig.js';

/**
 * Sets a secure HTTP-only cookie containing the refresh token.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {string} token - The refresh token string to be stored in the cookie.
 * @returns {void}
 *
 * @example
 * setRefreshTokenCookie(res, 'some-refresh-token');
 */
export const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: env(ENV_VARIABLES.NODE_ENV) === 'production',
    sameSite: 'Strict',
    maxAge: MAX_AGE_REFRESH_TOKENS * 1000, // 7 days
  };
  res.cookie(REFRESH_TOKEN_COOKIE, token, cookieOptions);
};

/**
 * Clears the refresh token cookie from the client.
 *
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 *
 * @example
 * clearRefreshTokenCookie(res);
 */
export const clearRefreshTokenCookie = res => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env(ENV_VARIABLES.NODE_ENV) === 'production',
    sameSite: 'Strict',
  });
};
