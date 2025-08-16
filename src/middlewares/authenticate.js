import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from '../utils/envConfig.js';
import ENV_VARIABLES from '../constants/ENV_VARIABLES.js';
import { getUserById } from '../services/usersServices.js';

const accessSecret = env(ENV_VARIABLES.JWT_ACCESS_SECRET);

/**
 * Middleware to authenticate requests via access token
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next middleware
 */
const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(createHttpError(401, 'Authorization header is missing'));
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Invalid authorization header'));
  }

  try {
    const payload = jwt.verify(token, accessSecret);
    const user = await getUserById(payload.sub);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }
  } catch (error) {
    return next(createHttpError(401, 'Invalid token'));
  }

  req.user = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatarUrl,
  };
  next();
};

export default auth;
