import { CSRF_TOKEN_COOKIE, MAX_AGE_CSRF_TOKEN } from "../constants/lifetimeVars.js";
import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";
import env from "./envConfig.js";

export const setCSRFTokenCookie = (res, token) => {
  const isProduction = env.NODE_ENV === 'production';
  
  // For cross-domain requests (localhost -> production), we need special settings
  const cookieOptions = {
    httpOnly: false,
    secure: true, // Always secure for cross-domain
    sameSite: 'None', // Must be None for cross-domain
    maxAge: MAX_AGE_CSRF_TOKEN * 1000,
    path: '/',
    domain: undefined, // Don't set domain to allow cross-domain access
  };
  
  console.log('Setting CSRF token cookie:', {
    token: token.substring(0, 10) + '...',
    options: cookieOptions,
    isProduction,
    nodeEnv: env.NODE_ENV
  });
  
  res.cookie(CSRF_TOKEN_COOKIE, token, cookieOptions);
};

export const clearCSRFTokenCookie = res => {
  const isProduction = env.NODE_ENV === 'production';
  res.clearCookie(CSRF_TOKEN_COOKIE, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax', // Use Lax for local development
  });
};
