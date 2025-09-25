import createHttpError from 'http-errors';
import * as services from '../services/shopsServices.js';
import parseFilterQuery from '../utils/pagination/parseFilterQuery.js';
import parsePaginationQuery from '../utils/pagination/parsePaginationQuery.js';
import ShopDTO from '../dto/shop/ShopDTO.js';
import ProductDTO from '../dto/product/ProductDTO.js';
import {
  createNewProduct,
  deleteProductById,
  getAllProductsByShopId,
  getFullProductInfo,
  getProductReview,
  updateProduct,
} from '../services/productsServices.js';
import { createReviews, updateReview } from '../services/reviewsServices.js';
import ReviewDTO from '../dto/review/reviewDTO.js';

/**
 * Controller to handle creating a new shop.
 *
 * Receives shop data from the request body, calls the service to create the shop,
 * and returns a success response with the created shop data.
 *
 * @async
 * @function createShopController
 * @param {import('express').Request} req - Express request object, expects shop data in `req.body`.
 * @param {import('express').Response} res - Express response object, used to send JSON response.
 * @param {import('express').NextFunction} next - Express next function, called for error handling.
 *
 * @returns {Promise<void>} Sends a JSON response with status 201 and the created shop data.
 */
export const createShopController = async (req, res, next) => {
  const id = req.user.id;
  const dataDTO = new ShopDTO(req.body);
  const data = await services.createShop({ user_id: id, data: dataDTO });
  res.status(201).json({
    status: 201,
    message: 'Shop was created successfully',
    data,
  });
};

/**
 * Controller to retrieve all shops.
 *
 * @async
 * @function getAllShopsController
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with all shops.
 *
 *  @example
 * // GET /shops?page=2&limit=10&username=john&category=electronics
 */
export const getAllShopsController = async (req, res, next) => {
  const pagination = parsePaginationQuery(req.query);
  const result = await services.getAllShops({ pagination });
  res.json({
    status: 200,
    message: 'Shops retrieved successfully',
    data: result,
  });
};

export const getAllUserShops = async (req, res, next) => {
  const pagination = parsePaginationQuery(req.query);
  const id = req.user.id;
  const result = await services.getAllShops({ pagination, query: { user_id: id } });
  res.json({
    status: 200,
    message: 'Users shops retrieved successfully',
    data: result,
  });
};

export const getAllMedicalShopsController = async (req, res, next) => {
  const pagination = parsePaginationQuery(req.query);
  const data = await services.getAllMedicalShopsController(pagination);
  res.json({
    status: 200,
    message: 'All medical shops retrieved successfully',
    data,
  });
};

export const getShopByIdController = async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw createHttpError(404, 'Shop not found');
  const data = await services.getShopById({ id });
  res.json({
    status: 200,
    message: "Successfully found shop and it's additional information",
    data,
  });
};

export const updateShopController = async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw createHttpError(404, 'Shop not found');
  const dataDTO = new ShopDTO(req.body);
  const data = await services.updateShop({ query: { id }, data: dataDTO });
  res.status(200).json({
    status: 200,
    message: 'Shop was updated successfully.',
    data,
  });
};

export const getAllProductsByShopIdController = async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw createHttpError(404, 'Shop not found');
  const pagination = parsePaginationQuery(req.query);
  const filter = parseFilterQuery(req.query);
  const data = await getAllProductsByShopId({ supplier_id: id, pagination, filter });
  res.json({
    status: 200,
    message: 'Products list by shop retrieved successfully.',
    data,
  });
};

export const createNewProductController = async (req, res, next) => {
  const { id: supplier_id } = req.params;
  if (!supplier_id) throw createHttpError(404, 'Shop not found');
  const dataDTO = new ProductDTO(req.body);
  const data = await createNewProduct({ ...dataDTO, supplier_id, file: req.file });
  res.json({
    status: 201,
    message: 'Product was created successfully',
    data,
  });
};

export const getProductByIdController = async (req, res, next) => {
  const { id, productId } = req.params;
  if (!id || !productId) throw createHttpError(404, 'Product not found');
  const data = await getFullProductInfo({ id: productId, supplier_id: id });
  res.json({
    status: 200,
    message: 'Product info was retrieved successfully',
    data,
  });
};

export const createProductReviewController = async (req, res, next) => {
  const { id: supplier_id, productId: product_id } = req.params;
  if (!supplier_id || !product_id) throw createHttpError(404, 'Product not found');
  const user = req.user;
  const dataDTO = new ReviewDTO(req.body);
  const data = await createReviews({ data: dataDTO, user, supplier_id, product_id });
  res.status(201).json({
    status: 201,
    message: 'Review was created successfully.',
    data,
  });
};

export const getProductReviewsController = async (req, res, next) => {
  const pagination = parsePaginationQuery(req.query);
  const { id: supplier_id, productId } = req.params;
  if (!productId || !supplier_id) throw createHttpError(404, 'Product not found');
  const data = await getProductReview({ pagination, supplier_id, id: productId });
  res.json({
    status: 200,
    message: 'Product reviews was successfully retrieved.',
    data,
  });
};

export const updateProductReviewController = async (req, res, next) => {
  const { id: supplier_id, productId: product_id, reviewId: id } = req.params;
  if (!id || !product_id || !supplier_id) throw createHttpError(404, 'Product not found');
  const user = req.user;
  const dataDTO = new ReviewDTO(req.body);
  const data = await updateReview({ id, product_id, user, newReview: dataDTO });
  res.json({
    status: 200,
    message: 'Review was updated successfully.',
    data,
  });
};

export const updateProductController = async (req, res, next) => {
  const { id: supplier_id, productId } = req.params;
  if (!productId || !supplier_id) throw createHttpError(404, 'Product not found');
  const dataDTO = new ProductDTO(req.body);
  const data = await updateProduct({ query: { id: productId, supplier_id }, data: dataDTO, file: req.file });
  res.json({
    status: 200,
    message: 'Product was updated successfully',
    data,
  });
};

export const deleteProductByIdController = async (req, res, next) => {
  const { id: supplier_id, productId: id } = req.params;
  if (!supplier_id || !id) throw createHttpError(404, 'Product not found');
  await deleteProductById({ supplier_id, id });
  res.status(204).send();
};
