import express from 'express';
import morgan from './morganConfig.js';
import cors from 'cors';

const app = express();

app.use(morgan('tiny-colored'));
app.use(cors());
app.use(
    express.json({
        type: ['application/json', 'application/vnd.api+json'],
    })
);

export default app;
