export const REFRESH_TOKEN_COOKIE = 'refreshToken';
export const MAX_AGE_REFRESH_TOKENS = 7 * 24 * 60 * 60; // 7 day

export const MAX_AGE_ACCESS_TOKENS = 15 * 60; // 15 minutes

// Authentication attempts limits
export const AUTH_ATTEMPTS_LIMIT = 3; // Maximum authentication attempts before lockout
export const AUTH_ATTEMPTS_WINDOW = 15 * 60 * 1000; // 15 minutes window for authentication attempts

// API request attempts limits
export const API_ATTEMPTS_LIMIT = 60; // Maximum API request attempts before temporary lockout
export const API_ATTEMPTS_WINDOW =  60 * 1000; // 1 minute window for API request attempts

// Sensitive request attempts limits
export const SENSITIVE_ATTEMPTS_LIMIT = 30; // Maximum sensitive request attempts before permanent lockout
export const SENSITIVE_ATTEMPTS_WINDOW = 60 * 1000; // 1 minute window for sensitive request attempts


export const MAX_STRING_LENGTH = 500; // Maximum string length