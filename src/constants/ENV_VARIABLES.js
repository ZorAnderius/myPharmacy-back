/**
 * Enum-like object containing environment variable keys used in the application.
 * Using Object.freeze to make it immutable.
 *
 * @constant {Object} ENV_VARIABLES
 * @property {string} NODE_ENV - Key for Node environment (e.g., 'development', 'production').
 * @property {string} PORT - Key for server port.
 * @property {Object} POSTGRES - Keys for PostgreSQL database configuration.
 * @property {string} POSTGRES.DB_PORT - Key for the database port.
 * @property {string} POSTGRES.DB_DIALECT - Key for the database dialect (e.g., 'postgres').
 * @property {string} POSTGRES.DB_USERNAME - Key for the database username.
 * @property {string} POSTGRES.DB_PASSWORD - Key for the database password.
 * @property {string} POSTGRES.DB_DATABASE - Key for the database name.
 * @property {string} POSTGRES.DB_HOST - Key for the database host.
 */
const ENV_VARIABLES = Object.freeze({
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  POSTGRES: {
    DB_PORT: 'DB_PORT',
    DB_DIALECT: 'DB_DIALECT',
    DB_USERNAME: 'DB_USERNAME',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_DATABASE: 'DB_DATABASE',
    DB_HOST: 'DB_HOST',
  },
  JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  GOOGLE_OAUTH: {
    CLIENT_ID: 'GOOGLE_OAUTH_CLIENT_ID',
    CLIENT_SECRET: 'GOOGLE_OAUTH_CLIENT_SECRET',
    REDIRECT_URI: 'GOOGLE_OAUTH_REDIRECT_URI',
  }
});

export default ENV_VARIABLES;
