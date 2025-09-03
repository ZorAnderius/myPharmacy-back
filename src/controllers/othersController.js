import { getAllCategory } from "../services/othersServices.js";

export const getAllCategoriesController = async (req, res, next) => {
  const data = await getAllCategory();
  res.json({
    status: 200,
    message: 'Categories retrieved successfully',
    data,
  });
};
