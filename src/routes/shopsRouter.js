import express from 'express';
import auth from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import validateBody from '../utils/validateBody.js';
import createShopSchema from '../schemas/shopsSchema/createShop.js';
import sensitiveLimiter from '../middlewares/requestLimit/sensitiveLimit.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import { createShopController, getAllShopsController } from '../controllers/shopsControllers.js';
import { inputSanitizationGuards, originGuards } from '../middlewares/middlewaresSet.js';
import secureInput from '../middlewares/secureInput.js';

const shopsRouter = express.Router();

shopsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllShopsController));

shopsRouter.use(auth);

shopsRouter.post('/create', [...inputSanitizationGuards, validateBody(createShopSchema), ...sensitiveLimiter], ctrlWrapper(createShopController));

export default shopsRouter;
