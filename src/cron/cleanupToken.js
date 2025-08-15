import cron from 'node-cron';
import { Op } from 'sequelize';
import RefreshToken from '../db/models/RefreshToken.js';

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

  console.log('Cleanup of expired and revoked tokens completed at', now);
});