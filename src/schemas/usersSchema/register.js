import Joi from 'joi';
import { emailRegexp, phoneRegexp } from '../../constants/inputVars.js';

/**
 * Joi schema for user registration.
 * Validates the following fields:
 * - firstName: string, 3-30 characters, required
 * - lastName: string, 3-30 characters, required
 * - email: string, must match `emailRegexp`, required
 * - password: string, 8-50 characters, required
 * - phoneNumber: string, exactly 10 digits, required
 *
 * Custom error messages are provided for each validation rule.
 *
 * @type {import('joi').ObjectSchema}
 */
const userRegisterSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    'string.base': `"firstName" should be a type of 'text'`,
    'string.empty': `"firstName" cannot be an empty field`,
    'string.min': `"firstName" should have a minimum length of {#limit}`,
    'string.max': `"firstName" should have a maximum length of {#limit}`,
    'any.required': `"firstName" is a required field`,
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    'string.base': `"lastName" should be a type of 'text'`,
    'string.empty': `"lastName" cannot be an empty field`,
    'string.min': `"lastName" should have a minimum length of {#limit}`,
    'string.max': `"lastName" should have a maximum length of {#limit}`,
    'any.required': `"lastName" is a required field`,
  }),
  email: Joi.string().trim().pattern(emailRegexp).required().messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.empty': `"email" cannot be an empty field`,
    'string.pattern.base': `"email" must be a valid email address as example@example.com`,
    'any.required': `"email" is a required field`,
  }),
  password: Joi.string().min(8).max(50).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'string.max': `"password" should have a maximum length of {#limit}`,
    'any.required': `"password" is a required field`,
  }),
  phoneNumber: Joi.string()
    .trim()
    .pattern(phoneRegexp)
    .required()
    .messages({
      'string.base': `"phoneNumber" should be a type of 'text'`,
      'string.empty': `"phoneNumber" cannot be an empty field`,
      'string.pattern.base': `"phoneNumber" must be a valid phone number starting with 07`,
      'any.required': `"phoneNumber" is a required field`,
    }),
});

export default userRegisterSchema;