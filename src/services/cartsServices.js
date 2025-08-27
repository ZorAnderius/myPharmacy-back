import createHttpError from 'http-errors';
import Cart from '../db/models/Cart.js';
import CartItem from '../db/models/CartItem.js';
import Product from '../db/models/Product.js';
import Supplier from '../db/models/Supplier.js';
import Category from '../db/models/Category.js';
import sequelize from '../db/sequelize.js';
import updateObjects from '../utils/updateObjects.js';

export const findCart = async (query, { transaction } = {}) => {
  return await Cart.findOne({
    where: query,
    transaction,
  });
};

export const findCartItem = async (query, { transaction } = {}) => {
  return await CartItem.findOne({
    where: query,
    transaction,
  });
};

export const getCartItems = async (query, { transaction } = {}) => {
  const cart = await Cart.findOne({
    where: query,
    include: [
      {
        model: CartItem,
        as: 'cart_item',
        attributes: ['id', 'quantity'],
        include: [
          {
            model: Product,
            as: 'product',
            attributes: { exclude: ['supplier_id', 'category_id', 'status_id'] },
            include: [
              { model: Supplier, as: 'shop', attributes: ['name'] },

              { model: Category, as: 'category', attributes: ['name'] },
            ],
          },
        ],
        separate: true,
        order: [['createdAt', 'ASC']],
      },
    ],
    transaction,
  });
  if (!cart) throw createHttpError(404, 'Cart not found');
  return cart;
};

export const createCartItem = async ({ user_id, data }) => {
  return await sequelize.transaction(async t => {
    let cart = await findCart({ user_id }, { transaction: t });
    if (!cart) {
      cart = await Cart.create({ user_id }, { transaction: t });
    }

    const { product_id, quantity } = updateObjects(data);
    if (!product_id || !quantity) throw createHttpError('400', 'Bad request');
    
    const cartItem = await findCartItem({ cart_id: cart.id, product_id }, { transaction: t });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save({ transaction: t });
    } else {
      await CartItem.create(
        {
          cart_id: cart.id,
          product_id,
          quantity,
        },
        { transaction: t }
      );
    }
    return await getCartItems({ user_id }, { transaction: t });
  });
};
