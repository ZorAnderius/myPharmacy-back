import cron from 'node-cron';
import { Op } from 'sequelize';
import RefreshToken from '../db/models/RefreshToken.js';

/**
 * Scheduled job to clean up old refresh tokens from the database.
 *
 * Runs every day at 03:00 server time.
 *
 * Deletion criteria:
 *  - Refresh tokens with `revoked = true` and `updatedAt` older than 7 days.
 *  - Refresh tokens with an `expires_at` date earlier than the current time.
 *
 * This helps:
 *  - Prevent database bloat from unused/revoked tokens.
 *  - Improve security by ensuring stale tokens are not stored indefinitely.
 *
 * @function
 * @async
 * @example
 * cron.schedule('0 3 * * *', async () => { ... });
 */
cron.schedule('0 3 * * *', async () => {
  const now = new Date();
  await RefreshToken.destroy({
    where: {
      [Op.or]: [
        {
          revoked: true,
          updatedAt: { [Op.lt]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }, // Tokens revoked more than 7 days
        },
        { expires_at: { [Op.lt]: now } }, // Expired tokens
      ],
    },
  });
});