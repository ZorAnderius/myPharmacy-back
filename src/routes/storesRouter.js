import express from 'express';
import { originGuards } from '../middlewares/middlewaresSet.js';
import secureInput from '../middlewares/secureInput.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import { getAllMedicalShopsController } from '../controllers/shopsControllers.js';

const storesRouter = express.Router();

//client route for all medical shops
storesRouter.get('/stores', [...originGuards, secureInput, apiLimit], ctrlWrapper(getAllMedicalShopsController));



export default storesRouter;
