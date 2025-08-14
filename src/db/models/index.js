import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sequelize from '../sequelize.js';

const modelsPath = resolve(process.cwd(), 'src', 'db', 'models');

/**
 * Container for all Sequelize models.
 * @type {Object.<string, import('sequelize').Model>}
 */
const db = {};

const modelFiles = readdirSync(modelsPath).filter(file => file.endsWith('.js') && file !== 'index.js');

for (const file of modelFiles) {
  const module = await import(`file://${join(modelsPath, file)}`);
  const model = module.default;
  model.initModel(sequelize);
  db[model.name] = model;
}

// Налаштування асоціацій
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize.Sequelize;

export default db;
