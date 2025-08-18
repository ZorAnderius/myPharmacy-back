import Address from '../db/models/Address.js';

/**
 * Finds an Address record based on the given query.
 *
 * @param {Object} query - The query object for filtering the address.
 * @param {Object} [options={}] - Optional Sequelize options (e.g., { transaction: t }).
 *
 * @returns {Promise<Address|null>} The found Address record, or null if not found.
 */
export const findAddress = async (query, options = {}) => {
  return await Address.findOne({ where: query, ...options });
};

/**
 * Creates a new Address record if it doesn't already exist.
 *
 * @param {Object} params - Address parameters.
 * @param {string} params.street - Street name.
 * @param {string} params.apartment - Apartment identifier.
 * @param {number} params.zipCodeId - ID of the associated ZipCode.
 * @param {Object} [options={}] - Optional Sequelize options (e.g., { transaction: t }).
 *
 * @returns {Promise<number>} The ID of the existing or newly created Address.
 */
export const createNewAddress = async ({ street, apartment, zipCodeId }, options = {}) => {
  const existingAddress = await findAddress({ street, apartment, zip_code_id: zipCodeId }, options);
  return existingAddress ? existingAddress.id : (await Address.create({ street, apartment, zip_code_id: zipCodeId }, options)).id;
};
