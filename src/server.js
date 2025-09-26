import app from './app.js';
import ENV_VARIABLES from './constants/ENV_VARIABLES.js';
import db from './db/models/index.js';
import './cron/cleanupToken.js';
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
    
    // Seed database with dynamic import and conditional logic
    // try {
      // const { default: seedDatabase } = await import('./db/seeds.js');
      // await db.sequelize.sync({force: true});
      // await seedDatabase();
    // } catch (seedError) {
      // console.log('\x1b[33mNote: Could not seed database\x1b[0m');
    // }

    app.listen(PORT, () => {
      console.log(`\x1b[35mServer is running on the port ${PORT}\x1b[0m`);
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default setupServer;
