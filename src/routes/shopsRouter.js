import express from 'express';
import auth from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import validateBody from '../utils/validateBody.js';
import createShopSchema from '../schemas/shopsSchema/createShopSchema.js';
import sensitiveLimiter from '../middlewares/requestLimit/sensitiveLimit.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import secureInput from '../middlewares/secureInput.js';
import updateShopSchema from '../schemas/shopsSchema/updateShopSchema.js';
import createProductSchema from '../schemas/productSchema/createProductSchema.js';
import upload from '../middlewares/upload.js';
import createReviewSchema from '../schemas/reviewsSchema/createReviewsSchema.js';
import { inputSanitizationGuards, originGuards } from '../middlewares/middlewaresSet.js';
import {
  createNewProductController,
  createProductReviewController,
  createShopController,
  getAllProductsByShopIdController,
  getAllShopsController,
  getProductByIdController,
  getProductReviewsController,
  getShopByIdController,
  updateProductController,
  updateProductReviewController,
  updateShopController,
} from '../controllers/shopsControllers.js';
import updateReviesSchema from '../schemas/reviewsSchema/updateReviewsSchema.js';
import updateProductSchema from '../schemas/productSchema/updateProductSchema.js';

const shopsRouter = express.Router();

shopsRouter.get('/', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllShopsController));

shopsRouter.use(auth);

shopsRouter.post('/create', [...inputSanitizationGuards, validateBody(createShopSchema), ...sensitiveLimiter], ctrlWrapper(createShopController));

shopsRouter.get('/:id', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getShopByIdController));

shopsRouter.patch('/:id/update', [...inputSanitizationGuards, ...apiLimit, validateBody(updateShopSchema)], ctrlWrapper(updateShopController));

shopsRouter.get('/:id/products/:productId/reviews', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getProductReviewsController));

shopsRouter.post(
  '/:id/products/:productId/reviews',
  [...inputSanitizationGuards, validateBody(createReviewSchema), ...sensitiveLimiter],
  ctrlWrapper(createProductReviewController)
);

shopsRouter.patch(
  '/:id/products/:productId/reviews/:reviewId',
  [...inputSanitizationGuards, validateBody(updateReviesSchema), ...sensitiveLimiter],
  ctrlWrapper(updateProductReviewController)
);

shopsRouter.get('/:id/products/:productId', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getProductByIdController));

shopsRouter.patch(
  '/:id/products/:productId/edit',
  [upload.single('product_image'), ...inputSanitizationGuards, validateBody(updateProductSchema), ...apiLimit],
  ctrlWrapper(updateProductController)
);

shopsRouter.post(
  '/:id/products/add',
  [upload.single('product_image'), ...inputSanitizationGuards, validateBody(createProductSchema), ...apiLimit],
  ctrlWrapper(createNewProductController)
);

shopsRouter.get('/:id/products', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(getAllProductsByShopIdController));

export default shopsRouter;
