import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from './morganConfig.js';
import corsOptions from '../middlewares/secureConf/corsConf.js';
import helmetOptions from '../middlewares/secureConf/helmetConf.js';
import csrfHeaderCheck from '../middlewares/secureConf/csrfHeaderCheck.js';

/**
 * Express application instance with configured middlewares.
 *
 * Middlewares included:
 * - Morgan: HTTP request logger with 'tiny-colored' format.
 * - CORS: Cross-Origin Resource Sharing using custom `corsOptions`.
 * - Helmet: Security headers using custom `helmetOptions`.
 * - Cookie Parser: Parses cookies from the request headers.
 * - express.json(): Parses incoming JSON requests with `Content-Type: application/json`.
 * - express.urlencoded(): Parses URL-encoded payloads with a 10kb limit.
 * - express.static(): Serves static files from the 'public' directory.
 */
const app = express();

app.use(morgan('tiny-colored'));
app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(csrfHeaderCheck);
app.use(
  express.json({
    type: ['application/json'],
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static('public'));

export default app;
