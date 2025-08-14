import express from 'express';
import morgan from './morganConfig.js';
import cors from 'cors';
import helmet from 'helmet';
import corsOptions from './corsConf.js';
import helmetOptions from './helmetConf.js';

const app = express();

app.use(morgan('tiny-colored'));
app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(
    express.json({
        type: ['application/json'],
    })
);
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(express.static('public'));

export default app;
