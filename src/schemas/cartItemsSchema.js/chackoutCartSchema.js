import Joi from 'joi';

const checkoutCartSchema = Joi.object({
  cartId: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': `"cartId" should be a type of 'UUID'`,
    'string.guid': `"cartId" must be a valid UUID v4`,
    'any.required': `"cartId" is a required field`,
  })
});

export default checkoutCartSchema;
