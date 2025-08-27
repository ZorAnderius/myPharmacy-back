import Joi from 'joi';

const createCartItemsSchema = Joi.object({
  product_id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': `"product_id" should be a type of 'UUID'`,
    'string.guid': `"product_id" must be a valid UUID v4`,
    'any.required': `"product_id" is a required field`,
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': `"quantity" should be a type of 'number'`,
    'number.integer': `"quantity" must be an integer`,
    'number.min': `"quantity" cannot be negative`,
    'any.required': `"quantity" is a required field`,
  }),
});

export default createCartItemsSchema;
