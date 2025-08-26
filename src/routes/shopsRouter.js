import express from 'express';
import auth from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import validateBody from '../utils/validateBody.js';
import createShopSchema from '../schemas/shopsSchema/createShopSchema.js';
import sensitiveLimiter from '../middlewares/requestLimit/sensitiveLimit.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import secureInput from '../middlewares/secureInput.js';
import { inputSanitizationGuards, originGuards } from '../middlewares/middlewaresSet.js';
import {
  createNewProductController,
  createShopController,
  getAllProductsByShopIdController,
  getAllShopsController,
  getProductByIdController,
  getProductReviewsController,
  getShopByIdController,
  updateProductController,
  updateShopController,
} from '../controllers/shopsControllers.js';
import updateShopSchema from '../schemas/shopsSchema/updateShopSchema.js';
import createProductSchema from '../schemas/productSchema/createProductSchema.js';
import upload from '../middlewares/upload.js';
import updateProductSchema from '../schemas/productSchema/updateProductSchema.js';

const shopsRouter = express.Router();

shopsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllShopsController));

shopsRouter.use(auth);

shopsRouter.post('/create', [...inputSanitizationGuards, validateBody(createShopSchema), ...sensitiveLimiter], ctrlWrapper(createShopController));

shopsRouter.get('/:id', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getShopByIdController));

shopsRouter.patch('/:id/update', [...inputSanitizationGuards, ...apiLimit, validateBody(updateShopSchema)], ctrlWrapper(updateShopController));

// shopsRouter.get('/:id/product/:productId/reviews', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getProductReviewsController));

// shopsRouter.get('/:id/product/:productId', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getProductByIdController));

// shopsRouter.patch(
//   ':id/product/:productId/edit',
//   [...inputSanitizationGuards, upload.single('product_image'), validateBody(updateProductSchema), sensitiveLimiter],
//   ctrlWrapper(updateProductController)
// );


shopsRouter.post(
  '/:id/products/add',
  [ upload.single('product_image'), ...inputSanitizationGuards, validateBody(createProductSchema), ...apiLimit,],
  ctrlWrapper(createNewProductController)
);

shopsRouter.get('/:id/products', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllProductsByShopIdController));

export default shopsRouter;
