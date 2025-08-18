import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import ENV_VARIABLES from '../constants/ENV_VARIABLES.js';
import env from './envConfig.js';

const GOOGLE_OAUTH_CLIENT_ID = env(ENV_VARIABLES.GOOGLE_OAUTH.CLIENT_ID);
const GOOGLE_OAUTH_CLIENT_SECRET = env(ENV_VARIABLES.GOOGLE_OAUTH.CLIENT_SECRET);
const GOOGLE_OAUTH_REDIRECT_URI = env(ENV_VARIABLES.GOOGLE_OAUTH.REDIRECT_URI);

/**
 * Google OAuth2 client instance.
 *
 * @type {import('google-auth-library').OAuth2Client}
 * @description
 * Used to perform OAuth2 authentication with Google APIs.
 */
const googleOAuthClient = new OAuth2Client({
  clientId: GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
});

/**
 * Generates a Google OAuth2 authentication URL.
 *
 * This URL can be used to redirect users to Google for authentication.
 * The access type is set to 'offline' to allow refresh tokens,
 * and the requested scopes include user's email and profile.
 *
 * @function generateAuthUrl
 * @returns {string} A URL string that the user can visit to authorize the application.
 */
export const generateAuthUrl = () => {
  return googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
  });
};

/**
 * Validates a Google OAuth2 authorization code and returns the ID token payload.
 *
 * @async
 * @function validateCode
 * @param {string} code - The authorization code received from Google OAuth2.
 * @returns {Promise<import('google-auth-library').LoginTicket>} The verified ID token ticket.
 * @throws {import('http-errors').HttpError} Throws 401 if the user is not authorized.
 * @throws {import('http-errors').HttpError} Throws 400 if the token is invalid.
 */
export const validateCode = async code => {
  try {
    const response = await googleOAuthClient.getToken(code);
    if (!response.tokens.id_token) throw createHttpError(401, 'Not authorized');
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: response.tokens.id_token,
      audience: GOOGLE_OAUTH_CLIENT_ID,
    });
    return ticket;
  } catch (error) {
    if (error.status === 400) throw createHttpError(error.status, 'Token is invalid');
    throw createHttpError(401, 'Not authorized');
  }
};

/**
 * Extracts the full name from a Google ID token payload.
 *
 * If the payload does not contain `given_name` or `family_name`, returns 'Guest'.
 *
 * @function getNameFromGoogleTokenPayload
 * @param {Object} payload - The Google ID token payload.
 * @param {string} [payload.given_name] - The user's given (first) name.
 * @param {string} [payload.family_name] - The user's family (last) name.
 * @returns {string} The full name in the format "GivenName FamilyName" or 'Guest' if not available.
 */
export const getNameFromGoogleTokenPayload = payload => {
  let name = 'Guest';
  if (payload.given_name && payload.family_name) {
    name = `${payload.given_name} ${payload.family_name}`;
  }
  return name;
};
