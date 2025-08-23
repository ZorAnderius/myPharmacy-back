import express from 'express';

const storesRouter = express.Router();

//client route for all medical shops
storesRouter.get('/stores', [...originGuards, secureInput, apiLimit], ctrlWrapper(getAllMedicalShopsController));

export default storesRouter;
