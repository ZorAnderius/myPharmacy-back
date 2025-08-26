import createHttpError from 'http-errors';
import sequelize from '../db/sequelize.js';
import { findProduct } from './productsServices.js';
import Review from '../db/models/Review.js';
import updateObjects from '../utils/updateObjects.js';
import User from '../db/models/User.js';

export const findReview = async (query, option = {}) => {
  return await Review.findOne({ where: query, option });
};

export const createReviews = async ({ data, supplier_id, user, product_id }) => {
  return sequelize.transaction(async t => {
    const product = await findProduct({ supplier_id, id: product_id }, { transaction: t });
    if (!product) throw createHttpError(404, 'Product not found');
    const review = await Review.create(
      {
        content: data.content,
        rating: data.rating,
        product_id,
        user_id: user.id,
      },
      { transaction: t }
    );
    return {
      id: review.id,
      content: review.content,
      rating: review.rating,
      createdAt: review.createdAt,
      author: {
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
      },
    };
  });
};

export const updateReview = async ({ id, user, product_id, newReview }) => {
  return sequelize.transaction(async t => {
    const review = await findReview({ id, user_id: user.id, product_id }, { transaction: t, lock: t.LOCK.UPDATE });
    if (!review) throw createHttpError(404, 'Review not found');
    const updateData = updateObjects(newReview);
    const updatedReview = await review.update(updateData, { returning: true, transaction: t });
    return {
      id: review.id,
      content: updatedReview.content,
      rating: updatedReview.rating,
      createdAt: updatedReview.createdAt,
      author: {
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
      },
    };
  });
};
