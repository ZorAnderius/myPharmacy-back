import CartItemDTO from '../dto/cartItem/CartItemDTO.js';
import { createCartItem, getCartItems } from '../services/cartsServices.js';

export const getCartItemsController = async (req, res, next) => {
  const user_id = req.user.id;
  const data = await getCartItems({ user_id });
  res.json({
    status: 200,
    message: 'Cart was recived successfully',
    data,
  });
};

export const createCartItemController = async (req, res, next) => {
  const user_id = req.user.id;
  const dataDTO = new CartItemDTO(req.body);
  const {cart, message} = await createCartItem({ user_id, data: dataDTO });
  res.status(201).json({
    status: 201,
    message,
    data: cart,
  });
};
