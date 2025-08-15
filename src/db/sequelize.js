import { Sequelize } from "sequelize";
import env from '../utils/envConfig.js';
import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";

/**
 * Sequelize instance configured for PostgreSQL.
 *
 * Reads configuration from environment variables using `env`.
 * Supports SSL, connection pooling, and default model definitions.
 *
 * @constant {import('sequelize').Sequelize} sequelize
 *
 * @property {object} pool - Connection pool configuration.
 * @property {number} pool.max - Maximum number of connections in pool.
 * @property {number} pool.min - Minimum number of connections in pool.
 * @property {number} pool.acquire - Maximum time (ms) to try acquiring a connection before throwing error.
 * @property {number} pool.idle - Maximum time (ms) a connection can be idle before being released.
 * @property {string} timezone - Sets timezone for timestamps.
 * @property {object} define - Default model definitions.
 * @property {boolean} define.timestamps - Automatically add createdAt and updatedAt fields.
 * @property {boolean} define.underscored - Use snake_case for automatically added fields.
 * @property {object} dialectOptions - Dialect-specific options.
 * @property {object} dialectOptions.ssl - SSL configuration.
 * @property {boolean} dialectOptions.ssl.require - Require SSL connection.
 * @property {boolean} dialectOptions.ssl.rejectUnauthorized - Whether to reject unauthorized SSL certificates.
 * @property {number} dialectOptions.connectTimeout - Maximum time (ms) to wait for connection.
 */
const sequelize = new Sequelize({
  dialect: env(ENV_VARIABLES.POSTGRES.DB_DIALECT),
  username: env(ENV_VARIABLES.POSTGRES.DB_USERNAME),
  port: env(ENV_VARIABLES.POSTGRES.DB_PORT, 5432),
  password: env(ENV_VARIABLES.POSTGRES.DB_PASSWORD),
  database: env(ENV_VARIABLES.POSTGRES.DB_DATABASE),
  host: env(ENV_VARIABLES.POSTGRES.DB_HOST),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectTimeout: 10000, 
  },
  pool: {
    max: 5, 
    min: 1, 
    acquire: 30000,
    idle: 5000, 
  },
  timezone: '+00:00',
  define: {
    timestamps: true,
    underscored: true,
  }
});

export default sequelize;