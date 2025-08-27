import { getCart } from '../services/cartsServices.js';

export const getCartController = async (req, res, next) => {
  const user_id = req.user.id;
  const data = await getCart({ user_id });
  res.json({
    status: 200,
    message: 'Cart was recived successfully',
    data,
  });
};
