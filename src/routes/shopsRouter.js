import express from 'express';
import auth from '../middlewares/authenticate.js';
import { requestIntegrityChecks } from '../middlewares/generalMiddlewareList.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import { createShopController } from '../controllers/shopsControllers.js';
import validateBody from '../utils/validateBody.js';

const shopsRouter = express.Router();

shopsRouter.use(auth);

shopsRouter.post('/create', [...requestIntegrityChecks, validateBody()], ctrlWrapper(createShopController));

export default shopsRouter;
