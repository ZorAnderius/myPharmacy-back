import Joi from 'joi';

const createReviewSchema = Joi.object({
  content: Joi.string().min(5).max(1200).required().messages({
    'string.base': `"content" should be a type of 'text'`,
    'string.empty': `"content" cannot be an empty field`,
    'string.min': `"content" should have a minimum length of {#limit}`,
    'string.max': `"content" should have a maximum length of {#limit}`,
    'any.required': `"content" is a required field`,
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': `"rating" should be a number`,
    'number.integer': `"rating" must be an integer`,
    'number.min': `"rating" should be at least {#limit}`,
    'number.max': `"rating" should be at most {#limit}`,
    'any.required': `"rating" is a required field`,
  }),
});

export default createReviewSchema;
