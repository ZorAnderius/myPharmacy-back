import { CSRF_TOKEN_COOKIE, MAX_AGE_CSRF_TOKEN } from "../constants/lifetimeVars.js";
import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";
import env from "./envConfig.js";

export const setCSRFTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: false,
    secure: true, // Always secure for cross-origin requests
    sameSite: 'None', // Required for cross-origin cookies
    maxAge: MAX_AGE_CSRF_TOKEN * 1000,
    path: '/',
    domain: undefined, // Let browser handle domain automatically
  };
  res.cookie(CSRF_TOKEN_COOKIE, token, cookieOptions);
};

export const clearCSRFTokenCookie = res => {
  res.clearCookie(CSRF_TOKEN_COOKIE, {
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    path: '/',
  });
};
