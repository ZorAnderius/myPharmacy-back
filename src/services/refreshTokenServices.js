export const createRefreshToken = async ({ user_id, jti, expires_at, ip, user_agent }) => {
  await RefreshTokenModel.create({
    user_id,
    jti,
    expires_at,
    ip,
    user_agent,
  });
  return { user_id, jti, expires_at, ip, user_agent };
};
