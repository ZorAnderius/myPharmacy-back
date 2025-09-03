import createHttpError from 'http-errors';
import Order from '../db/models/Order.js';
import OrderItem from '../db/models/OrderItem.js';
import Product from '../db/models/Product.js';
import User from '../db/models/User.js';
import countPaginationQuery from '../utils/pagination/countPaginationQuery.js';
import ProductStatus from '../db/models/ProductStatus.js';
import Category from '../db/models/Category.js';

export const generateOrderNumber = async ({ transaction } = {}) => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  const orderNumber = `${datePart}-${randomPart}`;

  const exist = await Order.findOne({
    where: {
      order_number: orderNumber,
    },
    transaction,
  });

  if (exist) {
    return generateOrderNumber(transaction);
  }
  return orderNumber;
};

export const getAllOrders = async ({ user_id, pagination: { page = 1, limit = 10 }, filter = {} }) => {
  const offset = (page - 1) * limit;
  const {rows: orders } = await Order.findAndCountAll({
    where: { user_id, ...filter },
    attributes: { exclude: ['user_id'] },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: OrderItem,
        as: 'orderItems',
        attributes: { exclude: ['order_id', 'product_id'] },
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'image_url'],
            include: [
              { model: ProductStatus, as: 'status', attributes: ['id', 'name'] },
              { model: Category, as: 'category', attributes: ['id', 'name'] },
            ],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  const paginationValues = countPaginationQuery(orders.length, page, limit);
  if (page > paginationValues.totalPages || page < 1) throw createHttpError(400, 'Page is out of range');
  return orders?.length > 0
    ? {
        orders,
        ...paginationValues,
      }
    : orders;
};

