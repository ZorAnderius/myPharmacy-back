import express from 'express';
import auth from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import validateBody from '../utils/validateBody.js';
import createShopSchema from '../schemas/shopsSchema/createShop.js';
import sensitiveLimiter from '../middlewares/requestLimit/sensitiveLimit.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import secureInput from '../middlewares/secureInput.js';
import { inputSanitizationGuards, originGuards } from '../middlewares/middlewaresSet.js';
import {
  createShopController,
  getAllProductsByShopIdController,
  getAllShopsController,
  getShopByIdController,
  updateShopController,
} from '../controllers/shopsControllers.js';

const shopsRouter = express.Router();

shopsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllShopsController));

shopsRouter.use(auth);

shopsRouter.post('/create', [...inputSanitizationGuards, validateBody(createShopSchema), ...sensitiveLimiter], ctrlWrapper(createShopController));

shopsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getShopByIdController));

shopsRouter.patch('/:id/update', [...inputSanitizationGuards, ...apiLimit], ctrlWrapper(updateShopController));

shopsRouter.get('/:id/product', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllProductsByShopIdController));

export default shopsRouter;
