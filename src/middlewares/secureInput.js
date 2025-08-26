import createHttpError from 'http-errors';
import { isSafeKey } from './secureConf/sanitizeObjects.js';

/**
 * Middleware to sanitize and validate incoming request data.
 *
 * This function:
 * - Validates uploaded file metadata (`originalname`, `filename`) against `isSafeKey`.
 * - Supports single file (`req.file`), multiple files (`req.files` as an array), 
 *   and field-based multiple files (`req.files` as an object).
 * - Rejects requests with unsafe file metadata or invalid input by returning
 *   a `400 Bad Request` error.
 *
 * @function secureInput
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 *
 * @throws {HttpError} Returns 400 if input sanitization fails or file metadata is unsafe.
 *
 * @example
 * app.post('/upload', secureInput, uploadHandler);
 */
const secureInput = (req, res, next) => {
  try {
    if (req.file) {
      if (!isSafeKey(req.file.originalname)) {
        return next(createHttpError(400, 'Invalid file metadata'));
      }
    }

    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        if (!isSafeKey(file.originalname)) {
          return next(createHttpError(400, 'Invalid file metadata'));
        }
      }
    }

    if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
      for (const field in req.files) {
        if (!Object.prototype.hasOwnProperty.call(req.files, field)) continue;
        for (const file of req.files[field]) {
          if (!isSafeKey(file.originalname)) {
            return next(createHttpError(400, 'Invalid file metadata'));
          }
        }
      }
    }
    next();
  } catch (error) {
    error instanceof createHttpError.HttpError
      ? next(createHttpError(400, error.message))
      : next(createHttpError(400, 'Invalid request: ' + (error.message ? `: ${error.message}` : '')));
  }
};

export default secureInput;
