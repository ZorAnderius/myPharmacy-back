import ZipCode from '../db/models/ZipCode.js';

/**
 * Finds a ZipCode record that matches the given query.
 *
 * @param {Object} query - The search criteria for the ZipCode (e.g., { code: 'SW1A 1AA' }).
 * @param {Object} [options={}] - Optional Sequelize query options (e.g., { transaction: t }).
 *
 * @returns {Promise<Object|null>} Returns the found ZipCode record or null if not found.
 */
export const findZipCode = async (query, options = {}) => {
  return await ZipCode.findOne({ where: query, ...options });
};

/**
 * Creates a new ZipCode record if it does not already exist.
 *
 * @param {Object} params - ZipCode details.
 * @param {string} params.code - The postal code.
 * @param {string} params.city - The city name.
 * @param {string} [params.region] - The region name (optional).
 * @param {string} [params.country] - The country name (optional).
 * @param {Object} [options={}] - Optional Sequelize options (e.g., { transaction: t }).
 *
 * @returns {Promise<number>} The ID of the existing or newly created ZipCode record.
 */
export const createZipCode = async ({ code, city, region = '', country = '' }, options = {}) => {
  const existsZipCode = await findZipCode({ code }, options);
  return existsZipCode ? existsZipCode.id : (await ZipCode.create({ code, city, region, country }, options)).id; // <-- також передаємо transaction
};
