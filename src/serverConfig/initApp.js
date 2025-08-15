import express from 'express';
import morgan from './morganConfig.js';
import cors from 'cors';
import helmet from 'helmet';
import corsOptions from './corsConf.js';
import helmetOptions from './helmetConf.js';

/**
 * Express application instance with configured middlewares.
 *
 * Middlewares included:
 * - Morgan: HTTP request logger with 'tiny-colored' format.
 * - CORS: Cross-Origin Resource Sharing using custom `corsOptions`.
 * - Helmet: Security headers using custom `helmetOptions`.
 * - express.json(): Parses incoming JSON requests with `Content-Type: application/json`.
 * - express.urlencoded(): Parses URL-encoded payloads with a 10kb limit.
 * - express.static(): Serves static files from the 'public' directory.
 */
const app = express();

app.use(morgan('tiny-colored'));
app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(
  express.json({
    type: ['application/json'],
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static('public'));

export default app;
