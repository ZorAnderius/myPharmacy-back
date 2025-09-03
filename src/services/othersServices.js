import Category from '../db/models/Category.js';
import ProductStatus from '../db/models/ProductStatus.js';

export const getAllCategory = async () => {
  const categories = await Category.findAll();
  return categories;
};

export const getAllProductStatus = async () => {
  const productStatus = await ProductStatus.findAll();
  return productStatus;
};