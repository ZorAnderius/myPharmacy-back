import Joi from 'joi';
import { emailRegexp, phoneRegexp, zipCodeRegexp } from '../../constants/inputVars.js';

/**
 * Joi validation schema for creating a new shop.
 *
 * Validates the following fields:
 * 
 * @property {string} name - Shop name, required, 3-50 characters.
 * @property {string} ownerName - Owner's name, required, 3-50 characters.
 * @property {string} phone - Phone number, required, must match UK format (07XXXXXXXXX).
 * @property {string} email - Email address, required, must match standard email format.
 * @property {string} street - Street address, required, 3-100 characters.
 * @property {string} city - City name, required, 2-100 characters.
 * @property {string} apartment - Apartment or unit identifier, required, 3-100 characters.
 * @property {string} zipCode - Zip/post code, required, must match UK postcode format.
 * @property {boolean} hasDelivery - Indicates if the shop provides delivery, required.
 */
const createShopSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 50 characters long',
  }),
  ownerName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Owner Name must be a string',
    'string.empty': 'Owner Name is required',
    'string.min': 'Owner Name must be at least 3 characters long',
    'string.max': 'Owner Name must be at most 50 characters long',
  }),
  phone: Joi.string().pattern(phoneRegexp).required().messages({
    'string.base': 'Phone must be a string',
    'string.empty': 'Phone is required',
    'string.pattern.base': 'Phone must be a valid UK phone number as 07XXXXXXXXX',
  }),
  email: Joi.string().trim().pattern(emailRegexp).required().messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.empty': `"email" cannot be an empty field`,
    'string.pattern.base': `"email" must be a valid email address as example@example.com`,
    'any.required': `"email" is a required field`,
  }),
  street: Joi.string().min(3).max(100).required().messages({
    'string.base': `"street" should be a type of 'text'`,
    'string.empty': `"street" cannot be an empty field`,
    'string.min': `"street" should have a minimum length of {#limit}`,
    'string.max': `"street" should have a maximum length of {#limit}`,
    'any.required': `"street" is a required field`,
  }),
  city: Joi.string().min(2).max(100).required().messages({
    'string.base': `"city" should be a type of 'text'`,
    'string.empty': `"city" cannot be an empty field`,
    'string.min': `"city" should have a minimum length of {#limit}`,
    'string.max': `"city" should have a maximum length of {#limit}`,
    'any.required': `"city" is a required field`,
  }),
  apartment: Joi.string().min(3).max(100).required().messages({
    'string.base': `"apartment" should be a type of 'text'`,
    'string.empty': `"apartment" cannot be an empty field`,
    'string.min': `"apartment" should have a minimum length of {#limit}`,
    'string.max': `"apartment" should have a maximum length of {#limit}`,
    'any.required': `"apartment" is a required field`,
  }),
  zipCode: Joi.string().pattern(zipCodeRegexp).required().messages({
    'string.base': 'Zip Code must be a string',
    'string.empty': 'Zip Code is required',
    'string.pattern.base': 'Zip Code must be a valid UK postcode',
  }),
  hasDelivery: Joi.boolean().required()
    .messages({
      'boolean.base': `"hasDelivery" should be a type of 'boolean'`,
      'any.required': `"hasDelivery" is a required field`,
    })
});

export default createShopSchema;
