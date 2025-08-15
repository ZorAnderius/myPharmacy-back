/**
 * Global error-handling middleware for Express.
 *
 * Sends a JSON response containing the error status, message, and error name.
 * Defaults to HTTP 500 and "Server error" if the error object does not specify them.
 *
 * @function errorHandler
 * @param {Error & { status?: number }} err - Error object, optionally with a `status` property.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message, data: err.name });
};

export default errorHandler;
