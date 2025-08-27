/**
 * Middleware to protect against CSRF attacks using a custom header.
 *
 * For state-changing HTTP methods (POST, PUT, DELETE), it checks if the
 * 'X-No-CSRF' header is present. If the header is missing, it responds
 * with 403 Forbidden.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Calls next() if the header is present or method is safe.
 */
const csrfHeaderCheck = (req, res, next) => {
  console.log(req.body);
  const method = req.method.toUpperCase();
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    if (!req.headers['x-no-csrf']) {
      return res.status(403).json({ message: 'CSRF header missing' });
    }
  }
  next();
}

export default csrfHeaderCheck;
