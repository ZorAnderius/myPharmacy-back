import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the main OpenAPI YAML file
const openApiPath = path.join(__dirname, '../../swagger/openapi.yaml');
const fileContents = fs.readFileSync(openApiPath, 'utf8');
const specs = YAML.parse(fileContents);

export { swaggerUi, specs };
