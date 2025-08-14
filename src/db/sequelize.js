import { Sequelize } from "sequelize";
import path from 'node:path';
import env from '../utils/envConfig.js';
import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";

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