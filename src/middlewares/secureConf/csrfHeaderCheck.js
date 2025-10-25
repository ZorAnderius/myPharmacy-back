/**
 * Middleware to protect against CSRF attacks using a custom header.
 *
 * For state-changing HTTP methods (POST, PUT, DELETE), it checks if the
 * 'X-CSRF-Token' header is present. If the header is missing, it responds
 * with 403 Forbidden.
 *
 * Security Note: Exceptions are made for /logout and /refresh endpoints
 * because they are protected by httpOnly secure cookies (refresh tokens)
 * which cannot be accessed via JavaScript, making CSRF protection via
 * header checks redundant. These endpoints validate tokens server-side.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Calls next() if the header is present or method is safe.
 */
const csrfHeaderCheck = (req, res, next) => {
  const method = req.method.toUpperCase();
  
  // Виняток для logout та refresh - вони використовують httpOnly secure cookies для аутентифікації
  // Refresh token валідується сервером, тому CSRF protection через header не потрібна
  const exemptPaths = ['/users/logout', '/users/refresh'];
  const isExempt = exemptPaths.some(path => req.path.includes(path));
  
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && !isExempt) {
    if (!req.headers['x-csrf-token']) {
      return res.status(403).json({ message: 'CSRF header missing' });
    }
  }
  next();
}

export default csrfHeaderCheck;
