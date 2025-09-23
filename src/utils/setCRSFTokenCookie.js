import { CSRF_TOKEN_COOKIE, MAX_AGE_CSRF_TOKEN } from "../constants/lifetimeVars.js";
import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";
import env from "./envConfig.js";

export const setCSRFTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: false,
    secure: env(ENV_VARIABLES.NODE_ENV) === 'production',
    sameSite: 'Strict',
    maxAge: MAX_AGE_CSRF_TOKEN * 1000,
  };
  res.cookie(CSRF_TOKEN_COOKIE, token, cookieOptions);
};

export const clearCSRFTokenCookie = res => {
  res.clearCookie(CSRF_TOKEN_COOKIE, {
    httpOnly: false,
    secure: env(ENV_VARIABLES.NODE_ENV) === 'production',
    sameSite: 'Strict',
  });
};
