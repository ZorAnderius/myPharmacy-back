import Joi from 'joi';
import { emailRegexp, phoneRegexp, zipCodeRegexp } from '../../constants/inputVars.js';

const updateShopSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 50 characters long',
    'string.empty': 'Name cannot be empty',
  }),
  ownerName: Joi.string().min(3).max(50).messages({
    'string.base': 'Owner Name must be a string',
    'string.min': 'Owner Name must be at least 3 characters long',
    'string.max': 'Owner Name must be at most 50 characters long',
    'string.empty': 'Owner Name cannot be empty',
  }),
  phone: Joi.string().pattern(phoneRegexp).messages({
    'string.base': 'Phone must be a string',
    'string.pattern.base': 'Phone must be a valid UK phone number as 07XXXXXXXXX',
    'string.empty': 'Phone cannot be empty',
  }),
  email: Joi.string().trim().pattern(emailRegexp).messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.empty': `"email" cannot be an empty field`,
    'string.pattern.base': `"email" must be a valid email address as example@example.com`,
  }),
  street: Joi.string().min(3).max(100).messages({
    'string.base': `"street" should be a type of 'text'`,
    'string.empty': `"street" cannot be an empty field`,
    'string.min': `"street" should have a minimum length of {#limit}`,
    'string.max': `"street" should have a maximum length of {#limit}`,
  }),
  city: Joi.string().min(2).max(100).messages({
    'string.base': `"city" should be a type of 'text'`,
    'string.empty': `"city" cannot be an empty field`,
    'string.min': `"city" should have a minimum length of {#limit}`,
    'string.max': `"city" should have a maximum length of {#limit}`,
  }),
  apartment: Joi.string().min(3).max(100).messages({
    'string.base': `"apartment" should be a type of 'text'`,
    'string.empty': `"apartment" cannot be an empty field`,
    'string.min': `"apartment" should have a minimum length of {#limit}`,
    'string.max': `"apartment" should have a maximum length of {#limit}`,
  }),
  zipCode: Joi.string().pattern(zipCodeRegexp).messages({
    'string.base': 'Zip Code must be a string',
    'string.empty': 'Zip Code cannot be empty',
    'string.pattern.base': 'Zip Code must be a valid UK postcode',
  }),
  hasDelivery: Joi.boolean().invalid(null, '').messages({
    'boolean.base': `"hasDelivery" should be a type of 'boolean'`,
    'any.invalid': `"hasDelivery" cannot be empty'`,
  }),
});

export default updateShopSchema;
