import express from 'express';
import ctrlWrapper from '../utils/controllerWrapper.js';
import secureInput from '../middlewares/secureInput.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import { originGuards } from '../middlewares/middlewaresSet.js';
import { getAllCategoriesController, getAllProductStatusController } from '../controllers/othersController.js';

const othersRouter = express.Router();

othersRouter.get('/categories', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllCategoriesController));

othersRouter.get('/product-statuses', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllProductStatusController));


export default othersRouter;
