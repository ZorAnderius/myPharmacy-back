import express from 'express';
import morgan from './morganConfig.js';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(morgan('tiny-colored'));
app.use(cors());
app.use(helmet());
app.use(
    express.json({
        type: ['application/json'],
    })
);
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(express.static('public'));

export default app;
