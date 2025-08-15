import createHttpError from 'http-errors';

/**
 * Middleware generator for validating the request body against a given schema.
 * Uses the provided schema's `validate` method and passes any validation errors to Express error handler.
 *
 * @param {Object} schema - Joi or similar validation schema with a `validate` method.
 * @returns {import('express').RequestHandler} - Express middleware function.
 *
 * @usage
 * app.post('/login', validateBody(userSchema), loginController);
 */
const validateBody = schema => {
  return (req, __, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(createHttpError(400, error.message));
    }
    next();
  };
};

export default validateBody;