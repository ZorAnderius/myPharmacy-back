import CartItemDTO from '../dto/cartItem/CartItemDTO.js';
import CheckoutCartDTO from '../dto/cartItem/CheckpotCartDTO.js';
import UpdateCartItemDTO from '../dto/cartItem/UpdateCartItemDRO.js';
import { checkoutCart, createCartItem, getCartItems, updateCart } from '../services/cartsServices.js';

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
  const { cart, message } = await createCartItem({ user_id, data: dataDTO });
  res.status(201).json({
    status: 201,
    message,
    data: cart,
  });
};

export const updateCartController = async (req, res, next) => {
  const user_id = req.user.id;
  const dataDTO = new UpdateCartItemDTO(req.body);
  const { cart, message } = await updateCart({ user_id, ...dataDTO });
  res.json({
    status: 200,
    message,
    data: cart,
  });
};

export const checkoutCartController = async (req, res, next) => {
  const user_id = req.user.id;
  const dataDTO = new CheckoutCartDTO(req.body);
  const data = await checkoutCart({ user_id, ...dataDTO });
  res.status(201).json({
    status: 201,
    message: 'Order create successsfuly.',
    data,
  });
};
