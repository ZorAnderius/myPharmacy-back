import * as services from '../services/shopsServices.js';

export const createShopController = async (req, res, next) => {
  const data = await services.createShop();
  res.status(201),
    json({
      status: 201,
      message: 'Shop was created successfully',
      data,
    });
};
