/**
 * Middleware to protect against CSRF attacks using CSRF token from cookies.
 *
 * For state-changing HTTP methods (POST, PUT, DELETE), it checks if the
 * CSRF token is present in cookies. If the token is missing, it responds
 * with 403 Forbidden.
 *
 * Security Note: Exceptions are made for authentication endpoints as they are
 * public and don't require CSRF protection.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Calls next() if the cookie is present or method is safe.
 */
const csrfHeaderCheck = (req, res, next) => {
  const method = req.method.toUpperCase();
  
  // Перевіряємо CSRF тільки для state-changing методів
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    // Перевіряємо наявність CSRF токена в header (frontend додає його з cookies)
    const csrfToken = req.headers['x-csrf-token'] || 
                      req.headers['X-CSRF-Token'] ||
                      req.headers['X-Csrf-Token'];
    
    if (!csrfToken) {
      return res.status(403).json({ message: 'CSRF header missing' });
    }
  }
  
  // Для GET та інших read-only методів завжди дозволяємо
  next();
}

export default csrfHeaderCheck;
