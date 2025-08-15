import createHttpError from 'http-errors';

/**
 * Middleware to handle requests to undefined routes.
 *
 * Creates an HTTP 404 error with the message "Route not found"
 * and passes it to the next error-handling middleware.
 *
 * @function notFoundHandler
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Callback to pass control to the next middleware.
 */
const notFoundHandler = (req, res, next) => {
    next(createHttpError(404, 'Route not found'));
};

export default notFoundHandler;
