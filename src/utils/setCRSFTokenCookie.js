import { CSRF_TOKEN_COOKIE, MAX_AGE_CSRF_TOKEN } from "../constants/lifetimeVars.js";
import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";
import env from "./envConfig.js";

export const setCSRFTokenCookie = (res, token) => {
  const isProduction = env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: false,
    secure: false, // Для localhost HTTP потрібно false
    sameSite: isProduction ? 'None' : 'Lax', // Для localhost використовуємо Lax
    maxAge: MAX_AGE_CSRF_TOKEN * 1000,
    path: '/',
    domain: undefined, // Let browser handle domain automatically
  };
  
  console.log('Setting CSRF cookie with options:', cookieOptions);
  res.cookie(CSRF_TOKEN_COOKIE, token, cookieOptions);
};

export const clearCSRFTokenCookie = res => {
  const isProduction = env.NODE_ENV === 'production';
  
  res.clearCookie(CSRF_TOKEN_COOKIE, {
    httpOnly: false,
    secure: false, // Для localhost HTTP потрібно false
    sameSite: isProduction ? 'None' : 'Lax',
    path: '/',
  });
};
