import Joi from 'joi';
import { emailRegexp } from '../constants/inputVars.js';

/**
 * Joi schema for validating user login credentials.
 *
 * Validates:
 * - email: Must be a string, trimmed, match `emailRegexp`, and is required.
 * - password: Must be a string, 8–50 characters, and is required.
 *
 * Custom error messages are provided for each validation rule.
 *
 * @type {import('joi').ObjectSchema}
 */
export const userLoginSchema = Joi.object({
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
});

export default userLoginSchema;