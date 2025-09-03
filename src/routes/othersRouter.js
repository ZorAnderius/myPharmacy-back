import express from 'express';
import ctrlWrapper from '../utils/controllerWrapper.js';
import secureInput from '../middlewares/secureInput.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import { originGuards } from '../middlewares/middlewaresSet.js';
import { getAllCategoriesController } from '../controllers/othersController.js';

const othersRouter = express.Router();

othersRouter.get('/categories', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllCategoriesController));

export default othersRouter;
