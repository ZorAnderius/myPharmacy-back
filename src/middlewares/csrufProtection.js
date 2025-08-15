import csurf from 'csurf';
import env from '../utils/envConfig.js';
import ENV_VARIABLES from '../constants/ENV_VARIABLES.js';

/**
 * CSRF protection middleware using `csurf`.
 *
 * Configures CSRF tokens to be stored in an HTTP-only cookie.
 * The cookie is secured (`secure: true`) in production and uses `SameSite=Strict`.
 *
 * @constant {import('csurf').CsrfOptions} csrfProtection
 */
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: env(ENV_VARIABLES.NODE_ENV) === 'production',
    sameSite: 'Strict',
  },
});

export default csrfProtection;
