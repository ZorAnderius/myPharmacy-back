import { ValidationError } from 'sequelize';

/**
 * Higher-order function that wraps an Express controller to handle errors.
 * Automatically catches any errors thrown in the controller and passes them to `next()`.
 * Specifically handles validation errors:
 *   - Sets status 400 for general ValidationError
 *   - Sets status 409 and custom message for SequelizeValidationError
 *
 * @param {Function} ctrl - The Express controller function to wrap. Should be async and accept (req, res, next).
 * @returns {Function} - A new async middleware function wrapping the original controller.
 *
 * @example
 * const wrappedController = ctrlWrapper(async (req, res, next) => {
 *   // controller logic here
 * });
 * app.get('/route', wrappedController);
 */
const ctrlWrapper = ctrl => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) {
        error.status = 400;
        if (error.name === 'SequelizeValidationError') {
          error.status = 409;
          error.message = 'Validation error occurred';
        }
      }
      next(error);
    }
  };
};

export default ctrlWrapper;
