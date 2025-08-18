import express from 'express';
import auth from '../middlewares/authenticate.js';

const shopsRouter = express.Router();

shopsRouter.use(auth);


export default shopsRouter;