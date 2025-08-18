import express from 'express';
import auth from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import validateBody from '../utils/validateBody.js';
import createShopSchema from '../schemas/shopsSchema/createShop.js';
import { csrfAndClientValidation, requestIntegrityChecks } from '../middlewares/generalMiddlewareList.js';
import { createShopController, getAllShopsController } from '../controllers/shopsControllers.js';

const shopsRouter = express.Router();

shopsRouter.use(auth);

shopsRouter.post('/create', [...requestIntegrityChecks, validateBody(createShopSchema)], ctrlWrapper(createShopController));

shopsRouter.get('/', [...csrfAndClientValidation], ctrlWrapper(getAllShopsController));

export default shopsRouter;
