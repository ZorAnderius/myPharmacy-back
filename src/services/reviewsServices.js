import createHttpError from 'http-errors';
import sequelize from '../db/sequelize.js';
import { findProduct } from './productsServices.js';
import Review from '../db/models/Review.js';

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
