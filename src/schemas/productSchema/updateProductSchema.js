import Joi from 'joi';

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(150).messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'string.max': `"name" should have a maximum length of {#limit}`,
  }),

  description: Joi.string().min(10).max(1000).messages({
    'string.base': `"description" should be a type of 'text'`,
    'string.empty': `"description" cannot be an empty field`,
    'string.min': `"description" should have a minimum length of {#limit}`,
    'string.max': `"description" should have a maximum length of {#limit}`,
  }),

  price: Joi.number().positive().precision(2).messages({
    'number.base': `"price" should be a type of 'number'`,
    'number.positive': `"price" must be a positive number`,
    'number.precision': `"price" can have up to {#limit} decimal places`,
  }),

  quantity: Joi.number().integer().min(0).messages({
    'number.base': `"quantity" should be a type of 'number'`,
    'number.integer': `"quantity" must be an integer`,
    'number.min': `"quantity" cannot be negative`,
  }),

  supplier_id: Joi.string().guid({ version: 'uuidv4' }).messages({
    'string.base': `"supplier_id" should be a type of 'UUID'`,
    'string.guid': `"supplier_id" must be a valid UUID v4`,
  }),

  catalog_id: Joi.string().guid({ version: 'uuidv4' }).messages({
    'string.base': `"catalog_id" should be a type of 'UUID'`,
    'string.guid': `"catalog_id" must be a valid UUID v4`,
  }),

  status_id: Joi.string().guid({ version: 'uuidv4' }).messages({
    'string.base': `"status_id" should be a type of 'UUID'`,
    'string.guid': `"status_id" must be a valid UUID v4`,
  }),
});

export default updateProductSchema;
