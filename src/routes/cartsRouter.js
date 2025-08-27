import express from 'express';
import auth from '../middlewares/authenticate.js';
import secureInput from '../middlewares/secureInput.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import { originGuards } from '../middlewares/middlewaresSet.js';
import { getCartController } from '../controllers/cartsControllers.js';

const cartsRouter = express.Router();

cartsRouter.use(auth);

cartsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getCartController));

export default cartsRouter;
