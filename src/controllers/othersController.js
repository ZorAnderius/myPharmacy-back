import { getAllCategory, getAllProductStatus } from '../services/othersServices.js';

export const getAllCategoriesController = async (req, res, next) => {
  const data = await getAllCategory();
  res.json({
    status: 200,
    message: 'Categories retrieved successfully',
    data,
  });
};

export const getAllProductStatusController = async (req, res, next) => {
  const data = await getAllProductStatus();
  res.json({
    status: 200,
    message: 'Product statuses retrieved successfully',
    data,
  });
};
