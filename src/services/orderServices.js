import Order from '../db/models/Order.js';

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
