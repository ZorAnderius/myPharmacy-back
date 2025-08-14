import * as service from '../services/usersServices.js';

export const registerController = async (req, res, next) => {
  const userDate = req.body;
    const result = await service.register(userDate);
    res.status(201).json({
        status: 201,
        message: 'User registered successfully',
        data: result,
    });
};

export const getUsersController = async (req, res, next) => {
  const users = await getUsers();
  res.json({
    status: 200,
    message: 'Users retrieved successfully',
    data: users,
  });
};
