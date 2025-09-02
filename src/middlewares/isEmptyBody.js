import createHttpError from 'http-errors';

/**
 * Middleware to check if the request body is empty.
 *
 * If the body does not contain any fields, it creates an HTTP 400 error
 * with the message "Body must have at least one field" and passes it to
 * the next error-handling middleware.
 *
 * @function isEmptyBody
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} _ - Express response object (unused).
 * @param {import('express').NextFunction} next - Callback to pass control to the next middleware.
 */
const isEmptyBody = (req, _, next) => {
  if (!Object.keys(req.body).length) {
    return next(createHttpError(400, 'Body must have at least one field'));
  }
  next();
};

export default isEmptyBody;
