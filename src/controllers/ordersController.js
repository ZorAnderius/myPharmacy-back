import { getAllOrders, getOrderById } from '../services/orderServices.js';
import parseFilterQuery from '../utils/pagination/parseFilterQuery.js';
import parsePaginationQuery from '../utils/pagination/parsePaginationQuery.js';

export const getAllOrdersController = async (req, res) => {
  const user_id = req.user.id;
  const pagination = parsePaginationQuery(req.query);
  const filter = parseFilterQuery(req.query);
  const data = await getAllOrders({ user_id, filter, pagination });
  res.json({
    status: 200,
    message: 'Orders founded successfully',
    data,
  });
};

export const getOrderByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await getOrderById(id);
  res.json({
    status: 200,
    message: 'Order founded successfully',
    data,
  });
};
