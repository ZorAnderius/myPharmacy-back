import app from './app.js';
import ENV_VARIABLES from './constants/ENV_VARIABLES.js';
import db from './db/models/index.js';
import './cron/cleanupToken.js';
import seedDatabase from './db/seeds.js';
import env from './utils/envConfig.js';

const PORT = env(ENV_VARIABLES.PORT, 3000);

/**
 * Sets up the Express server, syncs Sequelize models,
 * and seeds initial data from JSON files.
 *
 * @async
 */
const setupServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('\x1b[32mDatabase connected successfully!\x1b[0m');
    // // Seed initial data
    // await db.sequelize.sync({force: true});
    // await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\x1b[35mServer is running on the port ${PORT}\x1b[0m`);
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default setupServer;
