import Category from '../db/models/Category.js';

export const getAllCategory = async () => {
  const categories = await Category.findAll();
  return categories;
};
