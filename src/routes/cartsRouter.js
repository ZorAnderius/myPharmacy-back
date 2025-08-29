import express from 'express';
import auth from '../middlewares/authenticate.js';
import secureInput from '../middlewares/secureInput.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import validateBody from '../utils/validateBody.js';
import createCartItemsSchema from '../schemas/cartItemsSchema.js/createCartItemsSchema.js';
import updateCartItemsSchema from '../schemas/cartItemsSchema.js/updateCartItemSchena.js';
import checkoutCartSchema from '../schemas/cartItemsSchema.js/chackoutCartSchema.js';
import sensitiveLimiter from '../middlewares/requestLimit/sensitiveLimit.js';
import { inputSanitizationGuards, originGuards } from '../middlewares/middlewaresSet.js';
import { checkoutCartController, createCartItemController, getCartItemsController, updateCartController } from '../controllers/cartsControllers.js';

const cartsRouter = express.Router();

cartsRouter.use(auth);

cartsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getCartItemsController));

cartsRouter.post('/add', [...inputSanitizationGuards, validateBody(createCartItemsSchema), ...apiLimit], ctrlWrapper(createCartItemController));

cartsRouter.patch('/update', [...inputSanitizationGuards, validateBody(updateCartItemsSchema), ...apiLimit], ctrlWrapper(updateCartController));

cartsRouter.post('/checkout', [...inputSanitizationGuards, validateBody(checkoutCartSchema), ...sensitiveLimiter], ctrlWrapper(checkoutCartController));

export default cartsRouter;
