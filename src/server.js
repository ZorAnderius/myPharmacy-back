import app from './app.js';
import DB from './db/models/index.js';
import seedFromJson from './db/seedsFromJSON.js';

const PORT = 8000;

/**
 * Sets up the Express server, syncs Sequelize models,
 * and seeds initial data from JSON files.
 *
 * @async
 */
const setupServer = async () => {
  try {
    // await DB.sequelize.sync({ alter: true });
    // console.log(' All models synced');

    // // Seed initial data
    // await seedFromJson();

    app.listen(PORT, () => {
      console.log(`\x1b[35mServer is running on the port ${PORT}\x1b[0m`);
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default setupServer;
