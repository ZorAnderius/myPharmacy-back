import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from '../utils/envConfig.js';
import ENV_VARIABLES from '../constants/ENV_VARIABLES.js';
import { getJTI } from '../utils/tokenServices.js';
import { getUserById } from '../services/usersServices.js';
import { checkRevokedToken } from '../services/refreshTokenServices.js';
import { da } from '@faker-js/faker';

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
    //check if refresh token is valid, not expired and not revoked
    const jti = req.cookies.refreshToken ? getJTI(req.cookies.refreshToken) : null;
    const payload = jwt.verify(token, accessSecret);

    if (!jti) {
      return next(createHttpError(401, 'Refresh token is missing'));
    }

    const {
      revoked,
      User: user,
    } = await checkRevokedToken({
      jti,
      ip: req.ip,
      user_agent: req.get('User-Agent'),
      user_id: payload.sub,
    });

    if (revoked) {
      return next(createHttpError(401, 'Refresh token has been revoked'));
    }

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }
    req.jti = jti;
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
    };
  } catch (error) {
    return next(createHttpError(401, 'Invalid token'));
  }
  next();
};

export default auth;
