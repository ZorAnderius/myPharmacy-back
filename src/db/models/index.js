import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sequelize from '../sequelize.js';

const modelsPath = resolve(process.cwd(), 'src', 'db', 'models');

/**
 * Container for all Sequelize models.
 * @type {Object.<string, import('sequelize').Model>}
 */
const db = {};

/**
 * Reads all model files from the models directory, dynamically imports them,
 * initializes the models with the Sequelize instance, and sets up associations.
 *
 * @async
 * @returns {Promise<Object>} The object containing all initialized Sequelize models and Sequelize instance.
 */
async function initializeModels() {
  const modelFiles = readdirSync(modelsPath).filter(file => file.endsWith('.js') && file !== 'index.js');

  for (const file of modelFiles) {
    // Dynamically import model module
    const module = await import(`file://${join(modelsPath, file)}`);
    const model = module.default;

    // Initialize the model with sequelize instance
    model.initModel(sequelize);

    // Add initialized model to the db container
    db[model.name] = model;
  }

  // Setup associations between models if defined
  Object.values(db).forEach(model => {
    if (typeof model.associate === 'function') {
      model.associate(db);
    }
  });

  // Attach sequelize instances for convenience
  db.sequelize = sequelize;
  db.Sequelize = sequelize.Sequelize;

  return db;
}

const DB = await initializeModels();

export default DB;