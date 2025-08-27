import createHttpError from 'http-errors';
import Cart from '../db/models/Cart.js';
import CartItem from '../db/models/CartItem.js';
import Product from '../db/models/Product.js';
import Supplier from '../db/models/Supplier.js';
import Category from '../db/models/Category.js';

export const getCart = async query => {
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
  });
  if (!cart) throw createHttpError(404, 'Cart not found');
  return cart;
};
