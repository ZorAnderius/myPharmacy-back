import Joi from 'joi';

const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(150).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'string.max': `"name" should have a maximum length of {#limit}`,
    'any.required': `"name" is a required field`,
  }),

  description: Joi.string().min(10).max(2000).required().messages({
    'string.base': `"description" should be a type of 'text'`,
    'string.empty': `"description" cannot be an empty field`,
    'string.min': `"description" should have a minimum length of {#limit}`,
    'string.max': `"description" should have a maximum length of {#limit}`,
    'any.required': `"description" is a required field`,
  }),

  price: Joi.number().positive().precision(2).required().messages({
    'number.base': `"price" should be a type of 'number'`,
    'number.positive': `"price" must be a positive number`,
    'number.precision': `"price" can have up to {#limit} decimal places`,
    'any.required': `"price" is a required field`,
  }),

  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': `"quantity" should be a type of 'number'`,
    'number.integer': `"quantity" must be an integer`,
    'number.min': `"quantity" cannot be negative`,
    'any.required': `"quantity" is a required field`,
  }),

  category_id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': `"category_id" should be a type of 'UUID'`,
    'string.guid': `"category_id" must be a valid UUID v4`,
    'any.required': `"category_id" is a required field`,
  }),

  status_id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': `"status_id" should be a type of 'UUID'`,
    'string.guid': `"status_id" must be a valid UUID v4`,
    'any.required': `"status_id" is a required field`,
  }),
});

export default createProductSchema;
