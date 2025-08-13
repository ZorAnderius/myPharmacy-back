import fs from 'fs';
import path from 'path';
import sequelize from './sequelize.js';
import models from './models/index.js';

/**
 * @file seedFromJson.js
 * @description Imports all JSON data from the `src/db/data` folder into the database using Sequelize.
 */

/**
 * Seeds the database from JSON files.
 * Each JSON file should be named after the model it corresponds to (e.g., category.json -> Category model).
 */
async function seedFromJson() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Path to the data folder using process.cwd() for consistency
    const dataDir = path.join(process.cwd(), 'src', 'db', 'data');

    // Get all JSON files
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(dataDir, file);

      // Read JSON data
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Convert file name to model name (e.g., category.json -> Category)
      const modelName = path.basename(file, '.json').replace(/(^\w|_\w)/g, s => s.replace('_', '').toUpperCase());

      const Model = models[modelName];
      if (!Model) {
        console.warn(`Model "${modelName}" not found. Skipping file: ${file}`);
        continue;
      }

      // Bulk insert data, ignore duplicates
      await Model.bulkCreate(jsonData, { ignoreDuplicates: true });
      console.log(`Imported ${jsonData.length} records into model ${modelName}`);
    }

    console.log('Data import completed!');
    process.exit(0);
  } catch (err) {
    console.error('Import error:', err);
    process.exit(1);
  }
}

export default seedFromJson;
