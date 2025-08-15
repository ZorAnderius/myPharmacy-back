import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";
import env from "./envConfig.js";

const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: env(ENV_VARIABLES.NODE_ENV) === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  res.cookie('refreshToken', token, cookieOptions);
};

export default setRefreshTokenCookie;
