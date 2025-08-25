import createHttpError from 'http-errors';
import { generateAccessToken, getJTI, verifyAccessToken, verifyRefreshToken } from '../utils/tokenServices.js';
import { refreshTokenRotation } from '../services/refreshTokenServices.js';

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
    let payload = verifyAccessToken(token);
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(createHttpError(401, 'Refresh token is missing'));
    }
    let accessToken = token;
    let user = null;
    //if access token is not valid, verify the refresh token
    if (!payload) {
      const tokenDate = await verifyRefreshToken(refreshToken);
      user = tokenDate.user;
      accessToken = generateAccessToken(tokenDate.payload.sub, tokenDate.payload.email);
      refreshTokenRotation(tokenDate.payload.jti);
      payload = tokenDate.payload;
      req.jti = tokenDate.payload.jti;
    } else {
      // If access token is valid check if user is still active
      const jti = refreshToken ? getJTI(refreshToken) : null;
      if (!jti) {
        return next(createHttpError(401, 'Invalid refresh token'));
      }
      const data = await verifyRefreshToken(refreshToken, {
        jti,
        ip: req.ip,
        user_agent: req.get('User-Agent'),
        user_id: payload.sub,
      });
      if (data.revoked) {
        return next(createHttpError(401, 'Not authorized'));
      }
      user = data.user;
      req.jti = jti;
    }
    req.accessToken = accessToken;
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        role: user.role,
      };
    } else {
      return next(createHttpError(401, 'User not found'));
    }
  } catch (error) {
    return next(createHttpError(401, 'Invalid token'));
  }
  next();
};

export default auth;
