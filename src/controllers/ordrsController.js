import { getAllOrders } from '../services/orderServices.js';
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
