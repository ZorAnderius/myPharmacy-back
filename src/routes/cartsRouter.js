import express from 'express';
import auth from '../middlewares/authenticate.js';
import secureInput from '../middlewares/secureInput.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import validateBody from '../utils/validateBody.js';
import createCartItemsSchema from '../schemas/cartItemsSchema.js/createCartItemsSchema.js';
import { inputSanitizationGuards, originGuards } from '../middlewares/middlewaresSet.js';
import { createCartItemController, getCartItemsController, updateCartController } from '../controllers/cartsControllers.js';
import updateCartItemsSchema from '../schemas/cartItemsSchema.js/updateCartItemSchena.js';

const cartsRouter = express.Router();

cartsRouter.use(auth);

cartsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getCartItemsController));

cartsRouter.post('/add', [...inputSanitizationGuards, validateBody(createCartItemsSchema), ...apiLimit], ctrlWrapper(createCartItemController));

cartsRouter.patch('/update', [...inputSanitizationGuards, validateBody(updateCartItemsSchema), ...apiLimit], ctrlWrapper(updateCartController));

export default cartsRouter;
